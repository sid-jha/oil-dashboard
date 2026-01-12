# Oil Dashboard

Interactive dashboard for global oil flows and risk analysis. Explore reserves, production,
refining, and consumption with map-based and networked views.

## Features
- Sankey flow from reserves to production, refining, and consumption with region or country drill-down
- World map with metric toggles, trade routes, and chokepoint markers
- Vulnerability ranking with disruption simulator and impact summary

## Tech stack
- React + Vite
- D3 + d3-sankey
- Leaflet + React-Leaflet
- Tailwind CSS

## Getting started
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Data
Data lives in `src/data` with citations surfaced in the UI tooltips and headers.
