import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CashFlowTab } from '../components/CashFlowTab';
import { InvestmentsTab } from '../components/InvestmentsTab';
import { CategoriesTab } from '../components/CategoriesTab';
import { useAuth } from '../contexts/AuthContext';
import { useCashFlowData } from '../hooks/useCashFlowData';
import { useInvestmentConfig } from '../hooks/useInvestmentConfig';
import type { TabType } from '../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('cashflow');

  // Use Firestore hooks for logged users
  const { cashFlowData, loading: cashFlowLoading, addMonth, updateMonth, deleteMonth } = useCashFlowData();
  const { config: investmentConfig, loading: investmentLoading, updateConfig } = useInvestmentConfig();

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'cashflow', label: 'Cash Flow', icon: '💰' },
    { id: 'investments', label: 'Investimenti', icon: '📈' },
    { id: 'categories', label: 'Categorie', icon: '📂' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Warning Banner for non-logged users */}
      {!user && (
        <div className="bg-amber-600 text-white">
          <div className="container mx-auto px-4 py-3 text-center">
            <p className="font-medium">
              ⚠️ Attenzione: I dati visualizzati sono randomici e utilizzati solo a scopo dimostrativo.{' '}
              <Link to="/login" className="underline font-bold">Accedi</Link> per salvare i tuoi dati.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">InvestInsight</h1>

            {/* Auth Buttons */}
            <div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">Ciao, {user.displayName || user.email}</span>
                  <Link
                    to="/profile"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Profilo
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Accedi
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Registrati
                  </Link>
                </div>
              )}
            </div>
          </div>

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
          cashFlowLoading ? (
            <div className="text-center py-12">Caricamento dati...</div>
          ) : (
            <CashFlowTab
              cashFlowData={cashFlowData}
              onAddMonth={addMonth}
              onUpdateMonth={updateMonth}
              onDeleteMonth={deleteMonth}
            />
          )
        )}
        {activeTab === 'investments' && (
          investmentLoading ? (
            <div className="text-center py-12">Caricamento configurazione...</div>
          ) : (
            <InvestmentsTab config={investmentConfig} onUpdateConfig={updateConfig} />
          )
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
};
