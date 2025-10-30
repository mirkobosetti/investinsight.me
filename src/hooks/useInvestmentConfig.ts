import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getInvestmentConfig,
  saveInvestmentConfig,
  type InvestmentConfig,
} from '../services/firestore.service';

const DEFAULT_CONFIG: InvestmentConfig = {
  initialBalance: 0,
  monthlyInvestment: 200,
  annualROI: 7,
  yearsToSimulate: 30,
};

export const useInvestmentConfig = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<InvestmentConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load investment config
  useEffect(() => {
    if (!user) {
      setConfig(DEFAULT_CONFIG);
      setLoading(false);
      return;
    }

    const loadConfig = async () => {
      try {
        setLoading(true);
        const firestoreConfig = await getInvestmentConfig(user.uid);

        if (firestoreConfig) {
          setConfig(firestoreConfig);
        } else {
          // Initialize with default config
          await saveInvestmentConfig(user.uid, DEFAULT_CONFIG);
          setConfig(DEFAULT_CONFIG);
        }
      } catch (err) {
        console.error('Error loading investment config:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [user]);

  // Update config
  const updateConfig = useCallback(
    async (newConfig: InvestmentConfig) => {
      setConfig(newConfig);

      if (user) {
        try {
          await saveInvestmentConfig(user.uid, newConfig);
        } catch (err) {
          console.error('Error saving investment config:', err);
          setError(err as Error);
        }
      }
    },
    [user]
  );

  return {
    config,
    loading,
    error,
    updateConfig,
  };
};
