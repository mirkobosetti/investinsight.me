import { useState } from 'react';
import { CashFlowTab } from './components/CashFlowTab';
import { InvestmentsTab } from './components/InvestmentsTab';
import { GlobalTab } from './components/GlobalTab';
import type { TabType, CashFlowData, InvestmentConfig } from './types';
import { generateMockCashFlowData } from './utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cashflow');
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>(generateMockCashFlowData());
  const [investmentConfig, setInvestmentConfig] = useState<InvestmentConfig>({
    initialBalance: 0,
    monthlyInvestment: 200,
    annualROI: 7,
    yearsToSimulate: 30,
  });

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'cashflow', label: 'Cash Flow', icon: '💰' },
    { id: 'investments', label: 'Investimenti', icon: '📈' },
    { id: 'global', label: 'Simulazione Globale', icon: '🌍' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-4">InvestInsight</h1>

          {/* Tabs Navigation */}
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'cashflow' && (
          <CashFlowTab data={cashFlowData} onUpdateData={setCashFlowData} />
        )}
        {activeTab === 'investments' && (
          <InvestmentsTab config={investmentConfig} onUpdateConfig={setInvestmentConfig} />
        )}
        {activeTab === 'global' && (
          <GlobalTab cashFlowData={cashFlowData} investmentConfig={investmentConfig} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-gray-400 text-sm">
          InvestInsight - Gestione Capitale Personale
        </div>
      </footer>
    </div>
  );
}

export default App;
