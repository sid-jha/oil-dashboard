// Vulnerability and impact calculations

import { countries, getGlobalTotals, REGIONS } from '../data/oilData';
import { importDependencies, exportDestinations } from '../data/tradeFlows';
import { chokePoints } from '../data/chokePoints';

/**
 * Calculate vulnerability score for a country (0-100)
 * Higher score = more vulnerable to oil supply disruptions
 */
export const calculateVulnerabilityScore = (countryCode) => {
  const country = countries[countryCode];
  if (!country) return null;

  const {
    reserves,
    production,
    refiningCapacity,
    consumption
  } = country;

  // 1. Import Dependency (40% weight)
  // Countries that consume more than they produce are vulnerable
  const netImportRatio = Math.max(0, (consumption - production) / consumption);
  const importDependencyScore = netImportRatio * 100;

  // 2. Refining Gap (30% weight)
  // Countries without enough refining capacity are vulnerable
  // Even if they produce, they need to export crude and import products
  const refiningGap = Math.max(0, (consumption - refiningCapacity) / consumption);
  const refiningGapScore = refiningGap * 100;

  // 3. Reserve Buffer (20% weight)
  // Strategic reserves provide buffer (measured in days of consumption)
  // Assume strategic reserves = ~90 days for major economies
  const daysOfReserves = reserves > 0 ? (reserves * 1000) / (consumption * 365) : 0;
  // Score: 100 if no reserves, 0 if >2 years of reserves
  const reserveBufferScore = Math.max(0, 100 - (daysOfReserves / 730) * 100);

  // 4. Source Diversification (10% weight)
  // Countries relying on few suppliers are more vulnerable
  const imports = importDependencies[countryCode];
  let diversificationScore = 50; // Default for countries without detailed import data
  if (imports && imports.sources) {
    const sources = Object.entries(imports.sources).filter(([k]) => k !== 'OTHER');
    const topSourceShare = sources.length > 0 ? Math.max(...sources.map(([, v]) => v)) : 100;
    // Higher concentration = higher score (more vulnerable)
    diversificationScore = topSourceShare;
  }

  // Weighted total
  const totalScore =
    importDependencyScore * 0.40 +
    refiningGapScore * 0.30 +
    reserveBufferScore * 0.20 +
    diversificationScore * 0.10;

  return Math.min(100, Math.round(totalScore));
};

/**
 * Get vulnerability breakdown for detailed analysis
 */
export const getVulnerabilityBreakdown = (countryCode) => {
  const country = countries[countryCode];
  if (!country) return null;

  const {
    reserves,
    production,
    refiningCapacity,
    consumption
  } = country;

  const netPosition = production - consumption;
  const refiningGap = refiningCapacity - consumption;

  const imports = importDependencies[countryCode];
  let topSources = [];
  if (imports && imports.sources) {
    topSources = Object.entries(imports.sources)
      .filter(([k]) => k !== 'OTHER')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code, pct]) => ({
        code,
        name: countries[code]?.name || code,
        percentage: pct
      }));
  }

  return {
    country: country.name,
    code: countryCode,
    vulnerabilityScore: calculateVulnerabilityScore(countryCode),
    production,
    refiningCapacity,
    consumption,
    netPosition,
    refiningGap,
    isNetImporter: netPosition < 0,
    hasRefiningDeficit: refiningGap < 0,
    importVolume: Math.abs(Math.min(0, netPosition)),
    topSources,
    reservesDays: reserves > 0 ? Math.round((reserves * 1000) / (consumption * 365)) : 0
  };
};

/**
 * Calculate impact of a disruption on all countries
 * @param disabledCountries - Array of country codes that are "offline"
 * @param disruptedChokepoints - Array of chokepoint IDs that are blocked
 */
export const calculateDisruptionImpact = (disabledCountries = [], disruptedChokepoints = []) => {
  const globalTotals = getGlobalTotals();
  const impacts = [];

  // Calculate total production/refining lost
  let lostProduction = 0;
  let lostRefining = 0;

  disabledCountries.forEach(code => {
    const country = countries[code];
    if (country) {
      lostProduction += country.production;
      lostRefining += country.refiningCapacity;
    }
  });

  // Calculate chokepoint impact
  let chokepointBlockedFlow = 0;
  const affectedByChokepoint = new Set();

  disruptedChokepoints.forEach(cpId => {
    const cp = chokePoints.find(c => c.id === cpId);
    if (cp) {
      chokepointBlockedFlow += cp.throughput;
      cp.affectedImporters.forEach(c => affectedByChokepoint.add(c));
    }
  });

  // Calculate impact on each consuming country
  Object.entries(countries).forEach(([code, country]) => {
    if (country.consumption <= 0) return;

    let impactScore = 0;
    let lostSupply = 0;
    let impactReasons = [];

    // 1. Direct production loss impact
    // If they import from disabled countries
    const imports = importDependencies[code];
    if (imports && imports.sources) {
      disabledCountries.forEach(disabledCode => {
        const sourcePct = imports.sources[disabledCode] || 0;
        if (sourcePct > 0) {
          const lostVolume = (sourcePct / 100) * imports.totalImports;
          lostSupply += lostVolume;
          impactReasons.push(`Lost ${sourcePct}% imports from ${countries[disabledCode]?.name || disabledCode}`);
        }
      });
    }

    // 2. If the country itself is disabled
    if (disabledCountries.includes(code)) {
      // Domestic production and refining offline
      lostSupply += Math.min(country.production, country.consumption);
      impactReasons.push('Domestic production offline');
    }

    // 3. Chokepoint impact
    if (affectedByChokepoint.has(code)) {
      // Estimate portion of imports through blocked chokepoints
      const chokepointExposure = 0.3; // Simplified - 30% of imports affected
      lostSupply += country.consumption * chokepointExposure;
      impactReasons.push('Chokepoint blockage affecting imports');
    }

    // Calculate impact as percentage of consumption
    const impactPercentage = Math.min(100, (lostSupply / country.consumption) * 100);

    impacts.push({
      code,
      name: country.name,
      region: country.region,
      consumption: country.consumption,
      production: country.production,
      refiningCapacity: country.refiningCapacity,
      baseVulnerability: calculateVulnerabilityScore(code),
      lostSupply: Math.round(lostSupply * 100) / 100,
      impactPercentage: Math.round(impactPercentage),
      impactReasons
    });
  });

  // Sort by impact percentage (highest first)
  impacts.sort((a, b) => b.impactPercentage - a.impactPercentage);

  return {
    impacts,
    summary: {
      lostProduction,
      lostRefining,
      chokepointBlockedFlow,
      globalProductionLoss: (lostProduction / globalTotals.production) * 100,
      countriesAffected: impacts.filter(i => i.impactPercentage > 0).length
    }
  };
};

/**
 * Get all countries ranked by vulnerability
 */
export const getVulnerabilityRanking = () => {
  const rankings = Object.keys(countries)
    .map(code => getVulnerabilityBreakdown(code))
    .filter(v => v && v.consumption > 0.1) // Only countries with meaningful consumption
    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);

  return rankings;
};

/**
 * Get countries that would be most affected by a specific producer going offline
 */
export const getCountriesAffectedByProducer = (producerCode) => {
  const affected = [];
  const producer = countries[producerCode];
  if (!producer) return affected;

  Object.entries(importDependencies).forEach(([importerCode, data]) => {
    const dependencyPct = data.sources[producerCode] || 0;
    if (dependencyPct > 0) {
      affected.push({
        code: importerCode,
        name: countries[importerCode]?.name || importerCode,
        dependencyPercentage: dependencyPct,
        volumeAtRisk: (dependencyPct / 100) * data.totalImports
      });
    }
  });

  return affected.sort((a, b) => b.volumeAtRisk - a.volumeAtRisk);
};

/**
 * Get producers by export volume
 */
export const getTopProducers = (limit = 10) => {
  return Object.values(countries)
    .filter(c => c.production > 0)
    .sort((a, b) => b.production - a.production)
    .slice(0, limit);
};

/**
 * Get top refiners
 */
export const getTopRefiners = (limit = 10) => {
  return Object.values(countries)
    .filter(c => c.refiningCapacity > 0)
    .sort((a, b) => b.refiningCapacity - a.refiningCapacity)
    .slice(0, limit);
};

/**
 * Get top consumers
 */
export const getTopConsumers = (limit = 10) => {
  return Object.values(countries)
    .filter(c => c.consumption > 0)
    .sort((a, b) => b.consumption - a.consumption)
    .slice(0, limit);
};
