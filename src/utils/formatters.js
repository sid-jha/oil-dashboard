// Formatting utilities for the oil dashboard

/**
 * Format large numbers with appropriate suffixes
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return 'N/A';
  if (num === 0) return '0';

  if (Math.abs(num) >= 1000) {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: decimals
    });
  }

  return num.toFixed(decimals);
};

/**
 * Format oil values with appropriate units
 */
export const formatOilValue = (value, type) => {
  if (value === null || value === undefined) return 'N/A';

  switch (type) {
    case 'reserves':
      return `${formatNumber(value, 1)} billion bbl`;
    case 'production':
    case 'refining':
    case 'consumption':
      return `${formatNumber(value, 2)} M bbl/day`;
    case 'percentage':
      return `${formatNumber(value, 1)}%`;
    default:
      return formatNumber(value, 2);
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get CSS class for vulnerability score
 */
export const getVulnerabilityClass = (score) => {
  if (score >= 75) return 'score-critical';
  if (score >= 50) return 'score-high';
  if (score >= 25) return 'score-medium';
  return 'score-low';
};

/**
 * Get color for vulnerability score
 */
export const getVulnerabilityColor = (score) => {
  if (score >= 75) return '#EF4444'; // red-500
  if (score >= 50) return '#F97316'; // orange-500
  if (score >= 25) return '#EAB308'; // yellow-500
  return '#22C55E'; // green-500
};

/**
 * Get label for vulnerability level
 */
export const getVulnerabilityLabel = (score) => {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
};

/**
 * Format net position (surplus/deficit)
 */
export const formatNetPosition = (value) => {
  if (value === null || value === undefined) return 'N/A';

  const absValue = Math.abs(value);
  const formatted = `${formatNumber(absValue, 2)} M bbl/day`;

  if (value > 0.01) {
    return `+${formatted} (Surplus)`;
  } else if (value < -0.01) {
    return `-${formatted} (Deficit)`;
  }
  return 'Balanced';
};

/**
 * Get color for net position
 */
export const getNetPositionColor = (value) => {
  if (value > 0.01) return '#22C55E'; // green
  if (value < -0.01) return '#EF4444'; // red
  return '#9CA3AF'; // gray
};

/**
 * Format country name for display (shorten if needed)
 */
export const formatCountryName = (name, maxLength = 20) => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

/**
 * Generate color gradient for heatmap
 */
export const getHeatmapColor = (value, min, max) => {
  const normalized = (value - min) / (max - min);

  // Color gradient: green -> yellow -> orange -> red
  if (normalized < 0.25) {
    return '#22C55E';
  } else if (normalized < 0.5) {
    return '#EAB308';
  } else if (normalized < 0.75) {
    return '#F97316';
  }
  return '#EF4444';
};

/**
 * Format chokepoint throughput
 */
export const formatThroughput = (value) => {
  return `${formatNumber(value, 1)} M bbl/day`;
};

/**
 * Get region display color
 */
export const getRegionColor = (region) => {
  const colors = {
    'Middle East': '#D97706',
    'Americas': '#2563EB',
    'Europe & CIS': '#7C3AED',
    'Asia Pacific': '#059669',
    'Africa': '#DC2626'
  };
  return colors[region] || '#6B7280';
};

/**
 * Get lighter shade of region color (for backgrounds)
 */
export const getRegionColorLight = (region) => {
  const colors = {
    'Middle East': 'rgba(217, 119, 6, 0.2)',
    'Americas': 'rgba(37, 99, 235, 0.2)',
    'Europe & CIS': 'rgba(124, 58, 237, 0.2)',
    'Asia Pacific': 'rgba(5, 150, 105, 0.2)',
    'Africa': 'rgba(220, 38, 38, 0.2)'
  };
  return colors[region] || 'rgba(107, 114, 128, 0.2)';
};

/**
 * Format impact for simulation display
 */
export const formatImpact = (percentage) => {
  if (percentage === 0) return 'No Impact';
  if (percentage < 5) return 'Minimal';
  if (percentage < 15) return 'Moderate';
  if (percentage < 30) return 'Significant';
  if (percentage < 50) return 'Severe';
  return 'Critical';
};

/**
 * Get impact color
 */
export const getImpactColor = (percentage) => {
  if (percentage === 0) return '#6B7280';
  if (percentage < 5) return '#22C55E';
  if (percentage < 15) return '#EAB308';
  if (percentage < 30) return '#F97316';
  if (percentage < 50) return '#EF4444';
  return '#7F1D1D';
};
