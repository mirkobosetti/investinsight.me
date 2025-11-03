import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { DashboardTab } from '../components/DashboardTab'
import { CashFlowTab } from '../components/CashFlowTab'
import { InvestmentsTab } from '../components/InvestmentsTab'
import { CategoriesTab } from '../components/CategoriesTab'
import { Navbar } from '@/components/Navbar'
import { DemoWarningBanner } from '@/components/DemoWarningBanner'
import { useCashFlowData } from '../hooks/useCashFlowData'
import { useInvestmentConfig } from '../hooks/useInvestmentConfig'
import type { TabType } from '../types'

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  // Use Firestore hooks for logged users
  const {
    cashFlowData,
    loading: cashFlowLoading,
    addMonth,
    updateMonth,
    deleteMonth
  } = useCashFlowData()
  const {
    config: investmentConfig,
    loading: investmentLoading,
    updateConfig
  } = useInvestmentConfig()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Warning Banner for non-logged users */}
      <DemoWarningBanner />

      {/* Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} showTabs />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <DashboardTab
              onTabChange={setActiveTab}
              monthsCount={cashFlowData.months.length}
              hasInvestmentConfig={!!investmentConfig}
            />
          )}
          {activeTab === 'cashflow' &&
            (cashFlowLoading ? (
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
            ))}
          {activeTab === 'investments' &&
            (investmentLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="glass-card p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Caricamento configurazione...</p>
                </div>
              </div>
            ) : (
              <InvestmentsTab config={investmentConfig} onUpdateConfig={updateConfig} />
            ))}
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
  )
}
