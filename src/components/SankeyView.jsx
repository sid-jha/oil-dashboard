import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { countries, getRegionalTotals, REGIONS, REGION_COLORS } from '../data/oilData';
import { formatOilValue, getRegionColor } from '../utils/formatters';
import Tooltip from './common/Tooltip';

export default function SankeyView() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [viewMode, setViewMode] = useState('region'); // 'region' or 'country'
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight - 60;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Build Sankey data
    const { nodes, links } = buildSankeyData(viewMode, selectedRegion);

    // Create Sankey layout
    const sankeyLayout = sankey()
      .nodeId(d => d.id)
      .nodeWidth(20)
      .nodePadding(12)
      .nodeAlign(sankeyLeft)
      .extent([[50, 30], [width - 50, height - 30]]);

    const graph = sankeyLayout({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    });

    // Draw links
    const link = svg.append('g')
      .attr('class', 'sankey-links')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('class', 'sankey-link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => d.color || getRegionColor(d.source.region || 'Other'))
      .attr('stroke-width', d => Math.max(1, d.width))
      .style('opacity', 0.5)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 0.8);
        const sourceNode = d.source;
        const targetNode = d.target;
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: {
            title: `${sourceNode.name} → ${targetNode.name}`,
            value: formatOilValue(d.value, getLinkType(sourceNode, targetNode)),
            citation: d.citation || 'Flow calculated from production/consumption data'
          }
        });
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.5);
        setTooltip(null);
      });

    // Draw nodes
    const node = svg.append('g')
      .attr('class', 'sankey-nodes')
      .selectAll('g')
      .data(graph.nodes)
      .join('g')
      .attr('class', 'sankey-node');

    node.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.color || getRegionColor(d.region || 'Other'))
      .attr('stroke', '#00FF00')
      .attr('stroke-width', 2)
      .style('cursor', d => viewMode === 'region' && d.layer === 0 ? 'pointer' : 'default')
      .on('click', function(event, d) {
        if (viewMode === 'region' && d.region && d.layer !== undefined) {
          setSelectedRegion(d.region);
          setViewMode('country');
        }
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: {
            title: d.name,
            subtitle: d.region || getStageLabel(d.layer),
            value: formatOilValue(d.value, getNodeType(d.layer)),
            citation: d.citation || getDefaultCitation(d.layer)
          }
        });
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        setTooltip(null);
      });

    // Node labels
    node.append('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .attr('class', 'sankey-label')
      .style('font-size', '11px')
      .style('fill', '#e5e7eb')
      .text(d => {
        const maxLen = viewMode === 'country' ? 15 : 20;
        return d.name.length > maxLen ? d.name.substring(0, maxLen) + '...' : d.name;
      });

    // Stage labels - War Games style
    const stages = ['[RESERVES]', '[PRODUCTION]', '[REFINING]', '[CONSUMPTION]'];
    const stageX = [80, width * 0.33, width * 0.66, width - 80];

    svg.append('g')
      .selectAll('text')
      .data(stages)
      .join('text')
      .attr('x', (d, i) => stageX[i])
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-bold')
      .style('fill', '#00FF00')
      .style('font-family', 'Courier New, monospace')
      .style('letter-spacing', '2px')
      .text(d => d);

  }, [viewMode, selectedRegion]);

  const handleBackToRegions = () => {
    setViewMode('region');
    setSelectedRegion(null);
  };

  return (
    <div className="h-full flex flex-col p-4 font-mono" ref={containerRef}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {viewMode === 'country' && (
            <button
              onClick={handleBackToRegions}
              className="px-3 py-1 bg-black border-2 border-terminal-green hover:bg-terminal-green-dark text-terminal-green text-sm flex items-center gap-2 uppercase tracking-wide"
              style={{boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'}}
            >
              &lt; BACK TO REGIONS
            </button>
          )}
          <span className="text-terminal-green-dim text-sm uppercase tracking-wide">
            {viewMode === 'region'
              ? '&gt; CLICK REGION FOR COUNTRY DETAIL'
              : `&gt; SECTOR: ${selectedRegion.toUpperCase()}`}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Legend />
        </div>
      </div>

      {/* Sankey Diagram */}
      <div className="flex-1 bg-black border-2 border-terminal-green overflow-hidden" style={{boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.1), 0 0 10px rgba(0, 255, 0, 0.3)'}}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Tooltip */}
      {tooltip && <Tooltip {...tooltip} />}
    </div>
  );
}

// Legend component - War Games style
function Legend() {
  return (
    <div className="flex gap-4 text-xs font-mono">
      {Object.entries(REGION_COLORS).map(([region, color]) => (
        <div key={region} className="flex items-center gap-1">
          <div
            className="w-3 h-3"
            style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}
          />
          <span className="text-terminal-green uppercase tracking-wide">{region}</span>
        </div>
      ))}
    </div>
  );
}

// Build Sankey data structure
function buildSankeyData(viewMode, selectedRegion) {
  const nodes = [];
  const links = [];

  if (viewMode === 'region') {
    // Regional view
    const regions = getRegionalTotals();

    Object.entries(regions).forEach(([regionName, data]) => {
      const color = REGION_COLORS[regionName];

      // Reserves node
      nodes.push({
        id: `reserves-${regionName}`,
        name: regionName,
        region: regionName,
        value: data.reserves,
        layer: 0,
        color,
        citation: 'BP Statistical Review of World Energy 2024'
      });

      // Production node
      nodes.push({
        id: `production-${regionName}`,
        name: regionName,
        region: regionName,
        value: data.production,
        layer: 1,
        color,
        citation: 'OPEC Monthly Oil Market Report 2024, EIA'
      });

      // Refining node
      nodes.push({
        id: `refining-${regionName}`,
        name: regionName,
        region: regionName,
        value: data.refiningCapacity,
        layer: 2,
        color,
        citation: 'Oil & Gas Journal Worldwide Refining Survey 2024'
      });

      // Consumption node
      nodes.push({
        id: `consumption-${regionName}`,
        name: regionName,
        region: regionName,
        value: data.consumption,
        layer: 3,
        color,
        citation: 'EIA International Energy Statistics 2024'
      });

      // Links within region (simplified flow)
      // Reserves → Production (scaled by production/reserves ratio)
      links.push({
        source: `reserves-${regionName}`,
        target: `production-${regionName}`,
        value: Math.min(data.reserves * 0.04, data.production), // Scale reserves to daily basis
        color
      });

      // Production → Refining
      links.push({
        source: `production-${regionName}`,
        target: `refining-${regionName}`,
        value: Math.min(data.production, data.refiningCapacity),
        color
      });

      // Refining → Consumption
      links.push({
        source: `refining-${regionName}`,
        target: `consumption-${regionName}`,
        value: Math.min(data.refiningCapacity, data.consumption),
        color
      });
    });

    // Add cross-region trade flows
    addRegionalTradeFlows(nodes, links, regions);

  } else {
    // Country view for selected region
    const regionCountries = Object.values(countries).filter(c => c.region === selectedRegion);

    regionCountries.forEach(country => {
      const color = REGION_COLORS[country.region];

      // Only add nodes if value is significant
      if (country.reserves > 0.1) {
        nodes.push({
          id: `reserves-${country.code}`,
          name: country.name,
          region: country.region,
          value: country.reserves,
          layer: 0,
          color,
          citation: country.reservesCitation
        });
      }

      if (country.production > 0.01) {
        nodes.push({
          id: `production-${country.code}`,
          name: country.name,
          region: country.region,
          value: country.production,
          layer: 1,
          color,
          citation: country.productionCitation
        });
      }

      if (country.refiningCapacity > 0.01) {
        nodes.push({
          id: `refining-${country.code}`,
          name: country.name,
          region: country.region,
          value: country.refiningCapacity,
          layer: 2,
          color,
          citation: country.refiningCitation
        });
      }

      if (country.consumption > 0.01) {
        nodes.push({
          id: `consumption-${country.code}`,
          name: country.name,
          region: country.region,
          value: country.consumption,
          layer: 3,
          color,
          citation: country.consumptionCitation
        });
      }

      // Links
      if (country.reserves > 0.1 && country.production > 0.01) {
        links.push({
          source: `reserves-${country.code}`,
          target: `production-${country.code}`,
          value: Math.min(country.reserves * 0.04, country.production),
          color
        });
      }

      if (country.production > 0.01 && country.refiningCapacity > 0.01) {
        links.push({
          source: `production-${country.code}`,
          target: `refining-${country.code}`,
          value: Math.min(country.production, country.refiningCapacity),
          color
        });
      }

      if (country.refiningCapacity > 0.01 && country.consumption > 0.01) {
        links.push({
          source: `refining-${country.code}`,
          target: `consumption-${country.code}`,
          value: Math.min(country.refiningCapacity, country.consumption),
          color
        });
      }
    });
  }

  return { nodes, links };
}

// Add cross-region trade flows
function addRegionalTradeFlows(nodes, links, regions) {
  // Major trade flows between regions
  const tradeFlows = [
    // Middle East exports
    { from: 'Middle East', to: 'Asia Pacific', production: 8, refining: 3 },
    { from: 'Middle East', to: 'Europe & CIS', production: 2, refining: 1 },
    { from: 'Middle East', to: 'Americas', production: 1, refining: 0.5 },
    // Russia/CIS exports
    { from: 'Europe & CIS', to: 'Asia Pacific', production: 3, refining: 0.5 },
    // Americas internal
    { from: 'Americas', to: 'Americas', production: 5, refining: 4 },
    // Africa exports
    { from: 'Africa', to: 'Europe & CIS', production: 1.5, refining: 0 },
    { from: 'Africa', to: 'Asia Pacific', production: 1.5, refining: 0 },
  ];

  tradeFlows.forEach(flow => {
    if (flow.from !== flow.to) {
      // Cross-region production to refining
      if (flow.production > 0) {
        const sourceNode = nodes.find(n => n.id === `production-${flow.from}`);
        const targetNode = nodes.find(n => n.id === `refining-${flow.to}`);
        if (sourceNode && targetNode) {
          links.push({
            source: `production-${flow.from}`,
            target: `refining-${flow.to}`,
            value: flow.production,
            color: REGION_COLORS[flow.from]
          });
        }
      }
    }
  });
}

function getStageLabel(layer) {
  const stages = ['Reserves', 'Production', 'Refining', 'Consumption'];
  return stages[layer] || '';
}

function getNodeType(layer) {
  const types = ['reserves', 'production', 'refining', 'consumption'];
  return types[layer] || 'production';
}

function getLinkType(source, target) {
  if (target.layer === 1) return 'production';
  if (target.layer === 2) return 'refining';
  if (target.layer === 3) return 'consumption';
  return 'production';
}

function getDefaultCitation(layer) {
  const citations = [
    'BP Statistical Review of World Energy 2024',
    'OPEC Monthly Oil Market Report 2024',
    'Oil & Gas Journal Worldwide Refining Survey 2024',
    'EIA International Energy Statistics 2024'
  ];
  return citations[layer] || '';
}
