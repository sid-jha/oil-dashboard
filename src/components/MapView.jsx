import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import { countries, REGION_COLORS } from '../data/oilData';
import { chokePoints } from '../data/chokePoints';
import { formatOilValue, formatThroughput, getRegionColor } from '../utils/formatters';
import { ChokepointLegend, MetricLegend } from './common/Legend';
import 'leaflet/dist/leaflet.css';

const METRICS = {
  PRODUCTION: 'production',
  REFINING: 'refiningCapacity',
  CONSUMPTION: 'consumption',
  RESERVES: 'reserves'
};

const METRIC_LABELS = {
  [METRICS.PRODUCTION]: 'Production',
  [METRICS.REFINING]: 'Refining Capacity',
  [METRICS.CONSUMPTION]: 'Consumption',
  [METRICS.RESERVES]: 'Reserves'
};

const METRIC_COLORS = {
  [METRICS.PRODUCTION]: '#3B82F6',
  [METRICS.REFINING]: '#8B5CF6',
  [METRICS.CONSUMPTION]: '#10B981',
  [METRICS.RESERVES]: '#F59E0B'
};

export default function MapView() {
  const [activeMetric, setActiveMetric] = useState(METRICS.PRODUCTION);
  const [showChokepoints, setShowChokepoints] = useState(true);
  const [showTradeRoutes, setShowTradeRoutes] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countryData = Object.values(countries);

  // Get max value for scaling
  const maxValue = Math.max(...countryData.map(c => c[activeMetric] || 0));

  // Scale circle radius based on value
  const getRadius = (value) => {
    if (!value || value <= 0) return 0;
    const minRadius = 4;
    const maxRadius = 35;
    return minRadius + (value / maxValue) * (maxRadius - minRadius);
  };

  // Major trade routes
  const tradeRoutes = [
    // Middle East to Asia
    {
      path: [[26.5, 56], [12.5, 43], [2.5, 101.5], [35, 105]], // Hormuz -> Malacca -> China
      color: '#D97706',
      label: 'ME → Asia'
    },
    // Middle East to Europe via Suez
    {
      path: [[26.5, 56], [12.5, 43], [30.5, 32.5], [41, 29], [51, 10]],
      color: '#D97706',
      label: 'ME → Europe'
    },
    // West Africa to USA
    {
      path: [[5, 5], [37, -75]],
      color: '#DC2626',
      label: 'Africa → USA'
    },
    // Russia to China
    {
      path: [[55, 75], [35, 105]],
      color: '#7C3AED',
      label: 'Russia → China'
    },
    // Canada to USA
    {
      path: [[56, -106], [37, -95]],
      color: '#2563EB',
      label: 'Canada → USA'
    },
    // West Africa to Asia via Cape
    {
      path: [[5, 5], [-34, 18], [2.5, 101.5], [35, 105]],
      color: '#DC2626',
      label: 'Africa → Asia'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          {/* Metric selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Show:</span>
            <div className="flex gap-1">
              {Object.entries(METRICS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(value)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    activeMetric === value
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {METRIC_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle options */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showChokepoints}
              onChange={(e) => setShowChokepoints(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-300">Chokepoints</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showTradeRoutes}
              onChange={(e) => setShowTradeRoutes(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-300">Trade Routes</span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <MetricLegend metric={activeMetric} />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          style={{ height: '100%', width: '100%', background: '#1f2937' }}
          worldCopyJump={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Trade routes */}
          {showTradeRoutes && tradeRoutes.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route.path}
              color={route.color}
              weight={2}
              opacity={0.4}
              dashArray="5, 10"
            >
              <Popup>
                <div className="text-sm font-medium">{route.label}</div>
              </Popup>
            </Polyline>
          ))}

          {/* Country markers */}
          {countryData.map(country => {
            const value = country[activeMetric];
            const radius = getRadius(value);

            if (radius <= 0) return null;

            return (
              <CircleMarker
                key={country.code}
                center={country.coordinates}
                radius={radius}
                fillColor={METRIC_COLORS[activeMetric]}
                fillOpacity={0.7}
                color={getRegionColor(country.region)}
                weight={2}
                eventHandlers={{
                  click: () => setSelectedCountry(country)
                }}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-bold text-base">{country.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{country.region}</div>
                    <table className="text-sm">
                      <tbody>
                        <tr>
                          <td className="pr-3 text-gray-600">Reserves:</td>
                          <td className="font-medium">{formatOilValue(country.reserves, 'reserves')}</td>
                        </tr>
                        <tr>
                          <td className="pr-3 text-gray-600">Production:</td>
                          <td className="font-medium">{formatOilValue(country.production, 'production')}</td>
                        </tr>
                        <tr>
                          <td className="pr-3 text-gray-600">Refining:</td>
                          <td className="font-medium">{formatOilValue(country.refiningCapacity, 'refining')}</td>
                        </tr>
                        <tr>
                          <td className="pr-3 text-gray-600">Consumption:</td>
                          <td className="font-medium">{formatOilValue(country.consumption, 'consumption')}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-xs text-gray-400 mt-2 italic">
                      Source: {country.productionCitation}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Chokepoint markers */}
          {showChokepoints && chokePoints.map(cp => (
            <CircleMarker
              key={cp.id}
              center={cp.coordinates}
              radius={8}
              fillColor="#EF4444"
              fillOpacity={0.9}
              color="#FFFFFF"
              weight={2}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="font-bold text-base text-red-600">{cp.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{cp.description}</div>
                  <div className="bg-red-50 p-2 rounded mb-2">
                    <div className="text-lg font-bold text-red-700">
                      {formatThroughput(cp.throughput)}
                    </div>
                    <div className="text-xs text-red-600">
                      {cp.percentOfGlobal}% of global seaborne oil
                    </div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium mb-1">Vulnerable Routes:</div>
                    <ul className="list-disc list-inside text-gray-600">
                      {cp.vulnerableRoutes.map((route, i) => (
                        <li key={i}>{route}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 italic">
                    Source: {cp.citation}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          <MapUpdater />
        </MapContainer>
      </div>

      {/* Bottom panel with chokepoint summary */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <ChokepointLegend />
          <div className="text-xs text-gray-400">
            Click markers for details | Scroll to zoom | Drag to pan
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to handle map updates
function MapUpdater() {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount to fix rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}
