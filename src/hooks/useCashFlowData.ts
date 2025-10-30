import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  subscribeToMonths,
  addMonth as addMonthService,
  updateMonth as updateMonthService,
  deleteMonth as deleteMonthService,
  getUserProfile,
} from '../services/firestore.service';
import type { MonthData, CashFlowData } from '../types';
import { calculateCumulativeCapital } from '../utils';

export const useCashFlowData = () => {
  const { user } = useAuth();
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>({
    initialCapital: 0,
    months: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial capital and subscribe to months
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const loadData = async () => {
      try {
        setLoading(true);

        // Load profile to get initial capital
        const profile = await getUserProfile(user.uid);
        const initialCapital = profile?.initialCapital || 0;

        // Subscribe to months collection
        unsubscribe = subscribeToMonths(user.uid, (months) => {
          // Calculate cumulative capital
          const monthsWithCapital = calculateCumulativeCapital(months, initialCapital);

          setCashFlowData({
            initialCapital,
            months: monthsWithCapital,
          });
          setLoading(false);
        });
      } catch (err) {
        console.error('Error loading cash flow data:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    loadData();

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Add month
  const addMonth = useCallback(
    async (monthData: MonthData) => {
      if (!user) return;

      try {
        await addMonthService(user.uid, monthData);
      } catch (err) {
        console.error('Error adding month:', err);
        setError(err as Error);
        throw err;
      }
    },
    [user]
  );

  // Update month
  const updateMonth = useCallback(
    async (monthId: string, monthData: Partial<MonthData>) => {
      if (!user) return;

      try {
        await updateMonthService(user.uid, monthId, monthData);
      } catch (err) {
        console.error('Error updating month:', err);
        setError(err as Error);
        throw err;
      }
    },
    [user]
  );

  // Delete month
  const deleteMonth = useCallback(
    async (monthId: string) => {
      if (!user) return;

      try {
        await deleteMonthService(user.uid, monthId);
      } catch (err) {
        console.error('Error deleting month:', err);
        setError(err as Error);
        throw err;
      }
    },
    [user]
  );

  return {
    cashFlowData,
    loading,
    error,
    addMonth,
    updateMonth,
    deleteMonth,
  };
};
