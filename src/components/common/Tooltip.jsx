import { useEffect, useState } from 'react';

export default function Tooltip({ x, y, content }) {
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    // Adjust position to keep tooltip in viewport
    const tooltipWidth = 280;
    const tooltipHeight = 120;
    const padding = 10;

    let left = x + padding;
    let top = y + padding;

    // Check right edge
    if (left + tooltipWidth > window.innerWidth) {
      left = x - tooltipWidth - padding;
    }

    // Check bottom edge
    if (top + tooltipHeight > window.innerHeight) {
      top = y - tooltipHeight - padding;
    }

    setPosition({ left, top });
  }, [x, y]);

  if (!content) return null;

  return (
    <div
      className="tooltip"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translateZ(0)'
      }}
    >
      <div className="tooltip-title">{content.title}</div>
      {content.subtitle && (
        <div className="text-xs text-gray-400 mb-1">{content.subtitle}</div>
      )}
      <div className="tooltip-value">{content.value}</div>
      {content.details && (
        <div className="text-sm text-gray-300 mt-2">{content.details}</div>
      )}
      {content.citation && (
        <div className="tooltip-citation">
          Source: {content.citation}
        </div>
      )}
    </div>
  );
}
