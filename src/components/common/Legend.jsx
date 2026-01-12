import { REGION_COLORS } from '../../data/oilData';

export function RegionLegend({ compact = false }) {
  return (
    <div className={`flex ${compact ? 'gap-3' : 'gap-4'} text-xs`}>
      {Object.entries(REGION_COLORS).map(([region, color]) => (
        <div key={region} className="flex items-center gap-1">
          <div
            className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded`}
            style={{ backgroundColor: color }}
          />
          <span className="text-gray-400">{region}</span>
        </div>
      ))}
    </div>
  );
}

export function VulnerabilityLegend() {
  const levels = [
    { label: 'Critical (75+)', color: '#EF4444' },
    { label: 'High (50-74)', color: '#F97316' },
    { label: 'Medium (25-49)', color: '#EAB308' },
    { label: 'Low (0-24)', color: '#22C55E' }
  ];

  return (
    <div className="flex gap-4 text-xs">
      {levels.map(level => (
        <div key={level.label} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: level.color }}
          />
          <span className="text-gray-400">{level.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ChokepointLegend() {
  return (
    <div className="flex gap-4 text-xs">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-red-500 border border-white" />
        <span className="text-gray-400">Chokepoint</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-gray-400">Major Producer</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="text-gray-400">Major Refiner</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-400">Major Consumer</span>
      </div>
    </div>
  );
}

export function MetricLegend({ metric }) {
  const gradients = {
    reserves: ['#FEF3C7', '#F59E0B', '#B45309'],
    production: ['#DBEAFE', '#3B82F6', '#1D4ED8'],
    refining: ['#EDE9FE', '#8B5CF6', '#6D28D9'],
    consumption: ['#D1FAE5', '#10B981', '#047857']
  };

  const colors = gradients[metric] || gradients.production;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400">Low</span>
      <div className="flex h-3 w-24 rounded overflow-hidden">
        {colors.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="text-gray-400">High</span>
    </div>
  );
}
