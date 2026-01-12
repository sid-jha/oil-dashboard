import { useState } from 'react';
import SankeyView from './SankeyView';
import MapView from './MapView';
import VulnerabilityView from './VulnerabilityView';
import { getGlobalTotals } from '../data/oilData';
import { formatOilValue } from '../utils/formatters';

const VIEWS = {
  SANKEY: 'sankey',
  MAP: 'map',
  VULNERABILITY: 'vulnerability'
};

export default function Dashboard() {
  const [activeView, setActiveView] = useState(VIEWS.SANKEY);
  const globalTotals = getGlobalTotals();

  const tabs = [
    { id: VIEWS.SANKEY, label: 'Oil Flow Sankey', icon: '⚡' },
    { id: VIEWS.MAP, label: 'World Map', icon: '🌍' },
    { id: VIEWS.VULNERABILITY, label: 'Vulnerability Analysis', icon: '⚠️' }
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Global Oil Flow Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Reserves, Production, Refining & Consumption Analysis
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Global Reserves</div>
              <div className="text-amber-400 font-semibold">
                {formatOilValue(globalTotals.reserves, 'reserves')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Daily Production</div>
              <div className="text-blue-400 font-semibold">
                {formatOilValue(globalTotals.production, 'production')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Refining Capacity</div>
              <div className="text-purple-400 font-semibold">
                {formatOilValue(globalTotals.refiningCapacity, 'refining')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Daily Consumption</div>
              <div className="text-green-400 font-semibold">
                {formatOilValue(globalTotals.consumption, 'consumption')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mt-4 -mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`nav-tab ${activeView === tab.id ? 'active' : ''}`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeView === VIEWS.SANKEY && <SankeyView />}
        {activeView === VIEWS.MAP && <MapView />}
        {activeView === VIEWS.VULNERABILITY && <VulnerabilityView />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            Data sources: BP Statistical Review 2024, OPEC, EIA, Oil & Gas Journal
          </span>
          <span>
            Hover over elements for detailed citations
          </span>
        </div>
      </footer>
    </div>
  );
}
