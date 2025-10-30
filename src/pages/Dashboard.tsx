import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, PieChart, Wallet } from 'lucide-react';
import { CashFlowTab } from '../components/CashFlowTab';
import { InvestmentsTab } from '../components/InvestmentsTab';
import { CategoriesTab } from '../components/CategoriesTab';
import { Navbar } from '@/components/Navbar';
import { DemoWarningBanner } from '@/components/DemoWarningBanner';
import { useCashFlowData } from '../hooks/useCashFlowData';
import { useInvestmentConfig } from '../hooks/useInvestmentConfig';
import { useAuth } from '@/contexts/AuthContext';
import type { TabType } from '../types';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cashflow');
  const { user } = useAuth();

  // Use Firestore hooks for logged users
  const { cashFlowData, loading: cashFlowLoading, addMonth, updateMonth, deleteMonth } = useCashFlowData();
  const { config: investmentConfig, loading: investmentLoading, updateConfig } = useInvestmentConfig();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName.split(' ')[0];
    return 'Ospite';
  };

  return (
    <div className="min-h-screen">
      {/* Warning Banner for non-logged users */}
      <DemoWarningBanner />

      {/* Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} showTabs />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/10">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{getGreeting()}, {getUserName()}</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gestisci il tuo{' '}
              <span className="gradient-text">Patrimonio</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Monitora le tue finanze, analizza i flussi di cassa e pianifica i tuoi investimenti in un unico posto.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card glass-card-hover p-6 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Cash Flow</h3>
                </div>
                <p className="text-2xl font-bold gradient-text">{cashFlowData.months.length}</p>
                <p className="text-sm text-muted-foreground">Mesi tracciati</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card glass-card-hover p-6 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-semibold">Investimenti</h3>
                </div>
                <p className="text-2xl font-bold gradient-text">{investmentConfig ? '✓' : '-'}</p>
                <p className="text-sm text-muted-foreground">Configurati</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card glass-card-hover p-6 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <PieChart className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">Categorie</h3>
                </div>
                <p className="text-2xl font-bold gradient-text">Attive</p>
                <p className="text-sm text-muted-foreground">Personalizzate</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'cashflow' && (
            cashFlowLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="glass-card p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Caricamento dati...</p>
                </div>
              </div>
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
              <div className="flex items-center justify-center py-12">
                <div className="glass-card p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Caricamento configurazione...</p>
                </div>
              </div>
            ) : (
              <InvestmentsTab config={investmentConfig} onUpdateConfig={updateConfig} />
            )
          )}
          {activeTab === 'categories' && <CategoriesTab />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-primary/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold gradient-text">InvestInsight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestione Capitale Personale - {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
