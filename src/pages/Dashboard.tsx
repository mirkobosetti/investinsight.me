import { useState } from 'react';
import { CashFlowTab } from '../components/CashFlowTab';
import { InvestmentsTab } from '../components/InvestmentsTab';
import { CategoriesTab } from '../components/CategoriesTab';
import { Navbar } from '@/components/Navbar';
import { DemoWarningBanner } from '@/components/DemoWarningBanner';
import { useCashFlowData } from '../hooks/useCashFlowData';
import { useInvestmentConfig } from '../hooks/useInvestmentConfig';
import type { TabType } from '../types';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cashflow');

  // Use Firestore hooks for logged users
  const { cashFlowData, loading: cashFlowLoading, addMonth, updateMonth, deleteMonth } = useCashFlowData();
  const { config: investmentConfig, loading: investmentLoading, updateConfig } = useInvestmentConfig();

  return (
    <div className="min-h-screen">
      {/* Warning Banner for non-logged users */}
      <DemoWarningBanner />

      {/* Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} showTabs />

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
