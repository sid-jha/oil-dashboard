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
    { id: VIEWS.SANKEY, label: 'RESOURCE FLOW', icon: '▓' },
    { id: VIEWS.MAP, label: 'TACTICAL MAP', icon: '▒' },
    { id: VIEWS.VULNERABILITY, label: 'THREAT ANALYSIS', icon: '█' }
  ];

  return (
    <div className="flex flex-col h-screen font-mono">
      {/* Header */}
      <header className="bg-black border-b-2 border-terminal-green px-6 py-4" style={{boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'}}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-terminal-green tracking-wider">
              ▓▓▓ WOPR STRATEGIC RESOURCE CONTROL ▓▓▓
            </h1>
            <p className="text-terminal-green-dim text-sm mt-1 tracking-wide">
              &gt; GLOBAL SUPPLY CHAIN MONITORING SYSTEM v2.1
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-terminal-green-dim uppercase text-xs tracking-wider">RESERVES</div>
              <div className="text-terminal-blue font-bold tracking-wide">
                {formatOilValue(globalTotals.reserves, 'reserves')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-terminal-green-dim uppercase text-xs tracking-wider">PRODUCTION</div>
              <div className="text-terminal-green font-bold tracking-wide">
                {formatOilValue(globalTotals.production, 'production')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-terminal-green-dim uppercase text-xs tracking-wider">REFINING</div>
              <div className="text-terminal-amber font-bold tracking-wide">
                {formatOilValue(globalTotals.refiningCapacity, 'refining')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-terminal-green-dim uppercase text-xs tracking-wider">CONSUMPTION</div>
              <div className="text-terminal-green font-bold tracking-wide">
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
      <footer className="bg-black border-t-2 border-terminal-green px-6 py-2 text-xs text-terminal-green-dim font-mono" style={{boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'}}>
        <div className="flex justify-between tracking-wide">
          <span>
            &gt; DATA SOURCES: BP STATISTICAL REVIEW 2024, OPEC, EIA, OIL & GAS JOURNAL
          </span>
          <span>
            &gt; SYSTEM STATUS: OPERATIONAL | LAST UPDATE: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </footer>
    </div>
  );
}
