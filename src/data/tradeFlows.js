// Global Oil Trade Flows - Import dependencies by country
// Shows where each importing country sources its crude oil
// Values are percentages of total imports

export const importDependencies = {
  // Major importers and their source breakdown
  USA: {
    totalImports: 6.5, // million bbl/day (crude + products)
    sources: {
      CAN: 52,
      MEX: 8,
      SAU: 6,
      COL: 4,
      IRQ: 4,
      NGA: 3,
      BRA: 3,
      OTHER: 20
    }
  },
  CHN: {
    totalImports: 11.2,
    sources: {
      SAU: 17,
      RUS: 16,
      IRQ: 11,
      ARE: 8,
      OMN: 7,
      KWT: 6,
      AGO: 6,
      BRA: 5,
      OTHER: 24
    }
  },
  IND: {
    totalImports: 4.8,
    sources: {
      IRQ: 24,
      SAU: 18,
      RUS: 16,
      ARE: 11,
      KWT: 8,
      NGA: 5,
      USA: 4,
      OTHER: 14
    }
  },
  JPN: {
    totalImports: 2.9,
    sources: {
      SAU: 37,
      ARE: 28,
      KWT: 9,
      QAT: 7,
      RUS: 5,
      USA: 3,
      OTHER: 11
    }
  },
  KOR: {
    totalImports: 2.7,
    sources: {
      SAU: 28,
      ARE: 14,
      KWT: 12,
      IRQ: 11,
      USA: 9,
      RUS: 6,
      OTHER: 20
    }
  },
  DEU: {
    totalImports: 1.9,
    sources: {
      RUS: 12,
      USA: 11,
      KAZ: 10,
      NOR: 10,
      GBR: 9,
      NGA: 8,
      LBY: 7,
      OTHER: 33
    }
  },
  FRA: {
    totalImports: 1.1,
    sources: {
      SAU: 15,
      KAZ: 12,
      NGA: 11,
      RUS: 10,
      DZA: 9,
      USA: 8,
      OTHER: 35
    }
  },
  ITA: {
    totalImports: 1.2,
    sources: {
      LBY: 18,
      AZE: 15,
      IRQ: 14,
      SAU: 10,
      KAZ: 9,
      DZA: 7,
      OTHER: 27
    }
  },
  ESP: {
    totalImports: 1.2,
    sources: {
      NGA: 14,
      USA: 12,
      SAU: 11,
      MEX: 10,
      LBY: 9,
      BRA: 8,
      OTHER: 36
    }
  },
  NLD: {
    totalImports: 1.1,
    sources: {
      RUS: 15,
      NOR: 14,
      USA: 12,
      SAU: 10,
      GBR: 9,
      NGA: 8,
      OTHER: 32
    }
  },
  GBR: {
    totalImports: 0.9,
    sources: {
      NOR: 25,
      USA: 18,
      NGA: 10,
      SAU: 8,
      RUS: 5,
      OTHER: 34
    }
  },
  SGP: {
    totalImports: 1.3,
    sources: {
      ARE: 22,
      SAU: 18,
      KWT: 12,
      QAT: 10,
      IRQ: 8,
      MYS: 7,
      OTHER: 23
    }
  },
  TWN: {
    totalImports: 0.9,
    sources: {
      SAU: 30,
      KWT: 20,
      ARE: 15,
      IRQ: 10,
      USA: 8,
      OTHER: 17
    }
  },
  THA: {
    totalImports: 1.0,
    sources: {
      SAU: 25,
      ARE: 20,
      KWT: 15,
      OMN: 10,
      RUS: 8,
      OTHER: 22
    }
  },
  IDN: {
    totalImports: 0.9,
    sources: {
      SAU: 20,
      NGA: 15,
      AGO: 12,
      IRQ: 10,
      RUS: 10,
      OTHER: 33
    }
  },
  AUS: {
    totalImports: 0.7,
    sources: {
      MYS: 25,
      SGP: 20,
      ARE: 15,
      SAU: 10,
      KOR: 10,
      OTHER: 20
    }
  },
  POL: {
    totalImports: 0.5,
    sources: {
      RUS: 45,
      SAU: 15,
      NOR: 10,
      USA: 8,
      OTHER: 22
    }
  },
  ZAF: {
    totalImports: 0.4,
    sources: {
      SAU: 35,
      NGA: 25,
      AGO: 15,
      OTHER: 25
    }
  },
  BRA: {
    totalImports: 0.3,
    sources: {
      NGA: 30,
      DZA: 20,
      SAU: 15,
      IRQ: 10,
      OTHER: 25
    }
  },
  PHL: {
    totalImports: 0.4,
    sources: {
      SAU: 30,
      ARE: 25,
      KWT: 15,
      RUS: 10,
      OTHER: 20
    }
  }
};

// Export destinations for major producers
export const exportDestinations = {
  SAU: {
    totalExports: 7.3,
    destinations: {
      CHN: 25,
      JPN: 15,
      KOR: 12,
      IND: 11,
      USA: 6,
      SGP: 5,
      TWN: 4,
      OTHER: 22
    }
  },
  RUS: {
    totalExports: 5.0,
    destinations: {
      CHN: 35,
      IND: 20,
      DEU: 5,
      NLD: 4,
      POL: 4,
      OTHER: 32
    }
  },
  IRQ: {
    totalExports: 3.6,
    destinations: {
      CHN: 30,
      IND: 25,
      KOR: 10,
      USA: 8,
      ITA: 6,
      OTHER: 21
    }
  },
  ARE: {
    totalExports: 2.8,
    destinations: {
      JPN: 30,
      IND: 18,
      KOR: 15,
      CHN: 12,
      SGP: 8,
      OTHER: 17
    }
  },
  CAN: {
    totalExports: 3.8,
    destinations: {
      USA: 97,
      OTHER: 3
    }
  },
  USA: {
    totalExports: 4.0,
    destinations: {
      KOR: 15,
      NLD: 12,
      GBR: 10,
      CHN: 8,
      JPN: 7,
      IND: 6,
      OTHER: 42
    }
  },
  NGA: {
    totalExports: 1.0,
    destinations: {
      IND: 20,
      ESP: 15,
      NLD: 12,
      IDN: 10,
      FRA: 8,
      OTHER: 35
    }
  },
  KWT: {
    totalExports: 2.0,
    destinations: {
      KOR: 25,
      JPN: 20,
      CHN: 18,
      TWN: 12,
      IND: 10,
      OTHER: 15
    }
  },
  NOR: {
    totalExports: 1.7,
    destinations: {
      GBR: 35,
      NLD: 20,
      DEU: 15,
      USA: 10,
      OTHER: 20
    }
  },
  AGO: {
    totalExports: 1.0,
    destinations: {
      CHN: 60,
      IND: 15,
      USA: 8,
      OTHER: 17
    }
  }
};

// Calculate how much a country depends on a specific chokepoint
export const getChokepointExposure = (countryCode, chokepointAffectedExporters) => {
  const imports = importDependencies[countryCode];
  if (!imports) return 0;

  let exposedPercentage = 0;
  chokepointAffectedExporters.forEach(exporter => {
    if (imports.sources[exporter]) {
      exposedPercentage += imports.sources[exporter];
    }
  });

  return exposedPercentage;
};

// Get all source countries for a given importer
export const getImportSources = (countryCode) => {
  return importDependencies[countryCode]?.sources || {};
};

// Get all destination countries for a given exporter
export const getExportDestinations = (countryCode) => {
  return exportDestinations[countryCode]?.destinations || {};
};
