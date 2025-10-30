import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const DemoWarningBanner = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  if (user || !isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="bg-gradient-to-r from-warning/90 to-warning border-b border-warning/30 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm sm:text-base flex-1">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-warning-foreground animate-pulse" />
            <p className="font-semibold text-warning-foreground">
              Modalità Demo:{' '}
              <span className="font-normal">
                Dati randomici visualizzati.{' '}
                <Link
                  to="/login"
                  className="underline font-bold hover:text-background transition-colors inline-flex items-center gap-1"
                >
                  Accedi
                </Link>{' '}
                per salvare i tuoi dati reali.
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 text-warning-foreground hover:bg-warning-foreground/10 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
