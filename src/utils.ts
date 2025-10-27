import type { CashFlowData, InvestmentConfig, InvestmentMonth, MonthData, Expense } from './types';

// Predefined colors for expense categories
export const CATEGORY_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

// Get month name from index
export const getMonthName = (index: number): string => {
  const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  return months[index % 12];
};

// Calculate cumulative capital for each month
export const calculateCumulativeCapital = (
  months: MonthData[],
  initialCapital: number
): MonthData[] => {
  let cumulative = initialCapital;

  return months.map(month => {
    const totalExpenses = month.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    cumulative = cumulative + month.netSalary - totalExpenses;

    return {
      ...month,
      cumulativeCapital: cumulative,
    };
  });
};

// Calculate investment projections
export const calculateInvestmentProjections = (
  config: InvestmentConfig,
  startYear: number = 2025
): InvestmentMonth[] => {
  const { monthlyInvestment, annualROI, yearsToSimulate } = config;
  const monthlyROI = annualROI / 12 / 100;
  const totalMonths = yearsToSimulate * 12;

  const projections: InvestmentMonth[] = [];
  let portfolioValue = 0;
  let totalInvested = 0;

  for (let i = 0; i < totalMonths; i++) {
    // Add monthly investment
    totalInvested += monthlyInvestment;
    portfolioValue += monthlyInvestment;

    // Apply monthly returns
    portfolioValue = portfolioValue * (1 + monthlyROI);

    const monthIndex = i % 12;
    const year = startYear + Math.floor(i / 12);

    projections.push({
      month: getMonthName(monthIndex),
      year,
      totalInvested,
      portfolioValue: Math.round(portfolioValue * 100) / 100,
      returns: Math.round((portfolioValue - totalInvested) * 100) / 100,
    });
  }

  return projections;
};

// Generate mock cash flow data
export const generateMockCashFlowData = (): CashFlowData => {
  const initialCapital = 5000;
  const currentYear = 2025;

  const months: MonthData[] = Array.from({ length: 12 }, (_, i) => {
    const baseExpenses: Expense[] = [
      { id: `${i}-1`, category: 'Affitto', amount: 800, color: CATEGORY_COLORS[0] },
      { id: `${i}-2`, category: 'Cibo', amount: 400, color: CATEGORY_COLORS[1] },
      { id: `${i}-3`, category: 'Bollette', amount: 150, color: CATEGORY_COLORS[2] },
      { id: `${i}-4`, category: 'Trasporti', amount: 100, color: CATEGORY_COLORS[3] },
      { id: `${i}-5`, category: 'Svago', amount: 200, color: CATEGORY_COLORS[4] },
    ];

    return {
      month: getMonthName(i),
      year: currentYear,
      netSalary: 2500,
      grossSalary: 3500,
      expenses: baseExpenses,
      cumulativeCapital: 0, // Will be calculated
    };
  });

  const monthsWithCapital = calculateCumulativeCapital(months, initialCapital);

  return {
    initialCapital,
    months: monthsWithCapital,
  };
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
