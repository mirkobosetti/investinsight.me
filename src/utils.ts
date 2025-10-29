import type { CashFlowData, CashFlowConfig, InvestmentConfig, InvestmentMonth, MonthData, Expense } from './types';

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

// Generate mock cash flow data with realistic monthly variations
export const generateMockCashFlowData = (config: CashFlowConfig): CashFlowData => {
  const { initialCapital, baseNetSalary, baseGrossSalary, monthsToGenerate } = config;
  const currentYear = 2025;

  const months: MonthData[] = Array.from({ length: monthsToGenerate }, (_, i) => {
    // Salary variations (13th month in December, bonus in June)
    let netSalary = baseNetSalary;
    let grossSalary = baseGrossSalary;

    if (i === 11) { // December - 13th month
      netSalary += 2000;
      grossSalary += 2800;
    } else if (i === 5) { // June - summer bonus
      netSalary += 800;
      grossSalary += 1100;
    }

    // Base monthly expenses with realistic variations
    const baseExpenses: Expense[] = [
      {
        id: `${i}-1`,
        category: 'Affitto',
        amount: 850,
        color: CATEGORY_COLORS[0]
      },
      {
        id: `${i}-2`,
        category: 'Cibo',
        amount: Math.round(380 + Math.random() * 140), // 380-520
        color: CATEGORY_COLORS[1]
      },
      {
        id: `${i}-3`,
        category: 'Bollette',
        amount: [0, 1, 11].includes(i) ? Math.round(180 + Math.random() * 70) : Math.round(120 + Math.random() * 50), // Winter higher
        color: CATEGORY_COLORS[2]
      },
      {
        id: `${i}-4`,
        category: 'Trasporti',
        amount: Math.round(90 + Math.random() * 60), // 90-150
        color: CATEGORY_COLORS[3]
      },
      {
        id: `${i}-5`,
        category: 'Svago',
        amount: Math.round(150 + Math.random() * 150), // 150-300
        color: CATEGORY_COLORS[4]
      },
    ];

    // Add occasional extra expenses
    let expenseId = 6;

    // Vacation expenses in July/August
    if (i === 6 || i === 7) {
      baseExpenses.push({
        id: `${i}-${expenseId++}`,
        category: 'Vacanze',
        amount: Math.round(600 + Math.random() * 400), // 600-1000
        color: CATEGORY_COLORS[5]
      });
    }

    // Holiday gifts in December
    if (i === 11) {
      baseExpenses.push({
        id: `${i}-${expenseId++}`,
        category: 'Regali',
        amount: Math.round(300 + Math.random() * 300), // 300-600
        color: CATEGORY_COLORS[6]
      });
    }

    // Healthcare (random months)
    if ([1, 4, 9].includes(i)) {
      baseExpenses.push({
        id: `${i}-${expenseId++}`,
        category: 'Salute',
        amount: Math.round(80 + Math.random() * 120), // 80-200
        color: CATEGORY_COLORS[7]
      });
    }

    // Clothing/Shopping (spring and autumn)
    if ([2, 3, 8, 9].includes(i)) {
      baseExpenses.push({
        id: `${i}-${expenseId++}`,
        category: 'Abbigliamento',
        amount: Math.round(100 + Math.random() * 200), // 100-300
        color: CATEGORY_COLORS[5]
      });
    }

    // Occasional dining out / entertainment
    if (Math.random() > 0.4) {
      baseExpenses.push({
        id: `${i}-${expenseId++}`,
        category: 'Ristoranti',
        amount: Math.round(80 + Math.random() * 120), // 80-200
        color: CATEGORY_COLORS[6]
      });
    }

    return {
      month: getMonthName(i),
      year: currentYear,
      netSalary,
      grossSalary,
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
