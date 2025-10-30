import type { InvestmentConfig, InvestmentMonth, MonthData } from './types';

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

// Get full month name from index
export const getFullMonthName = (index: number): string => {
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  return months[index % 12];
};

// Sort months chronologically
export const sortMonthsChronologically = (months: MonthData[]): MonthData[] => {
  return [...months].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.month - b.month;
  });
};

// Format month display
export const formatMonthDisplay = (month: number, year: number): string => {
  return `${getMonthName(month)} ${year}`;
};

// Calculate cumulative capital for each month
export const calculateCumulativeCapital = (
  months: MonthData[],
  initialCapital: number
): MonthData[] => {
  // Sort months chronologically first
  const sortedMonths = sortMonthsChronologically(months);
  let cumulative = initialCapital;

  return sortedMonths.map(month => {
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
  const { initialBalance, monthlyInvestment, annualROI, yearsToSimulate } = config;
  const monthlyROI = annualROI / 12 / 100;
  const totalMonths = yearsToSimulate * 12;

  const projections: InvestmentMonth[] = [];
  let portfolioValue = initialBalance;
  let totalInvested = initialBalance;

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
