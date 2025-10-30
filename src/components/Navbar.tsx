import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  User,
  LogOut,
  TrendingUp,
  Wallet,
  TrendingUpIcon,
  FolderOpen,
  Menu,
  X,
  type LucideIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TabType } from '@/types'

interface NavbarProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
  showTabs?: boolean
}

export const Navbar = ({ activeTab, onTabChange, showTabs = false }: NavbarProps) => {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
    { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
    { id: 'investments', label: 'Investimenti', icon: TrendingUpIcon },
    { id: 'categories', label: 'Categorie', icon: FolderOpen }
  ]

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Errore durante il logout:', error)
    }
  }

  const handleTabChange = (tab: TabType) => {
    onTabChange?.(tab)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full glass-card border-b border-primary/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
              <div className="relative">
                <TrendingUp className="h-7 w-7 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="gradient-text">InvestInsight</span>
            </Link>

            {/* Desktop Tabs Navigation */}
            {showTabs && onTabChange && (
              <nav className="hidden md:flex items-center gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <motion.div key={tab.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        onClick={() => onTabChange(tab.id)}
                        className="gap-2 relative"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg border border-primary/30"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  )
                })}
              </nav>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              {showTabs && onTabChange && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/50 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border-primary/20" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">
                          {user.displayName || 'Utente'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profilo</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Accedi</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/signup">Registrati</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && showTabs && onTabChange && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 z-50 w-72 glass-card border-l border-primary/20 md:hidden overflow-y-auto"
            >
              <nav className="flex flex-col gap-2 p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <motion.div
                      key={tab.id}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        onClick={() => handleTabChange(tab.id)}
                        className="w-full justify-start gap-3 h-12"
                        size="lg"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-base">{tab.label}</span>
                      </Button>
                    </motion.div>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
