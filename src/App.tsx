import { useState } from 'react';
import { CashFlowTab } from './components/CashFlowTab';
import { InvestmentsTab } from './components/InvestmentsTab';
import { CategoriesTab } from './components/CategoriesTab';
import type { TabType, CashFlowData, CashFlowConfig, InvestmentConfig } from './types';
import { generateMockCashFlowData } from './utils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cashflow');
  const [cashFlowConfig, setCashFlowConfig] = useState<CashFlowConfig>({
    initialCapital: 8500,
    baseNetSalary: 2400,
    baseGrossSalary: 3300,
    monthsToGenerate: 12,
  });
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>(
    generateMockCashFlowData(cashFlowConfig)
  );
  const [investmentConfig, setInvestmentConfig] = useState<InvestmentConfig>({
    initialBalance: 0,
    monthlyInvestment: 200,
    annualROI: 7,
    yearsToSimulate: 30,
  });

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'cashflow', label: 'Cash Flow', icon: '💰' },
    { id: 'investments', label: 'Investimenti', icon: '📈' },
    { id: 'categories', label: 'Categorie', icon: '📂' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Warning Banner */}
      <div className="bg-amber-600 text-white">
        <div className="container mx-auto px-4 py-3 text-center">
          <p className="font-medium">
            ⚠️ Attenzione: I dati visualizzati sono randomici e utilizzati solo a scopo dimostrativo
          </p>
        </div>
      </div>

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
          <CashFlowTab
            config={cashFlowConfig}
            data={cashFlowData}
            onUpdateConfig={setCashFlowConfig}
            onUpdateData={setCashFlowData}
          />
        )}
        {activeTab === 'investments' && (
          <InvestmentsTab config={investmentConfig} onUpdateConfig={setInvestmentConfig} />
        )}
        {activeTab === 'categories' && <CategoriesTab />}
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
