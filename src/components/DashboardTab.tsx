import { motion } from 'framer-motion'
import { Wallet, TrendingUpIcon, FolderOpen, ArrowRight, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { TabType } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardTabProps {
  onTabChange: (tab: TabType) => void
  monthsCount: number
  hasInvestmentConfig: boolean
}

export const DashboardTab = ({
  onTabChange,
  monthsCount,
  hasInvestmentConfig
}: DashboardTabProps) => {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buongiorno'
    if (hour < 18) return 'Buon pomeriggio'
    return 'Buonasera'
  }

  const getUserName = () => {
    if (user?.displayName) return user.displayName.split(' ')[0]
    return 'Ospite'
  }

  const quickActions = [
    {
      id: 'cashflow' as TabType,
      title: 'Cash Flow',
      description: 'Traccia entrate e uscite mensili',
      icon: Wallet,
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      stats: `${monthsCount} mesi`
    },
    {
      id: 'investments' as TabType,
      title: 'Investimenti',
      description: 'Configura e simula i tuoi investimenti',
      icon: TrendingUpIcon,
      gradient: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/10',
      iconColor: 'text-secondary',
      stats: hasInvestmentConfig ? 'Configurato' : 'Da configurare'
    },
    {
      id: 'categories' as TabType,
      title: 'Categorie',
      description: 'Gestisci le categorie di spesa',
      icon: FolderOpen,
      gradient: 'from-accent/20 to-accent/5',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      stats: 'Personalizzate'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {getGreeting()}, {getUserName()}
          </span>
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Gestisci il tuo <span className="gradient-text">Patrimonio</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitora le tue finanze, analizza i flussi di cassa e pianifica i tuoi investimenti in un
          unico posto.
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="glass"
                hover
                className={`cursor-pointer group bg-gradient-to-br ${action.gradient} border-2 border-transparent hover:border-primary/30 h-full`}
                onClick={() => onTabChange(action.id)}
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex p-4 rounded-2xl ${action.iconBg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`h-8 w-8 ${action.iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                  <p className="text-muted-foreground mb-4">{action.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{action.stats}</span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <Card variant="outline" padding="lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold mb-2">Inizia a tracciare le tue finanze</h3>
              <p className="text-sm text-muted-foreground">
                Seleziona una delle sezioni qui sopra per iniziare a gestire il tuo patrimonio in
                modo intelligente.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div
                className="h-2 w-2 rounded-full bg-secondary animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="h-2 w-2 rounded-full bg-accent animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
