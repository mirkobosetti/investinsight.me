// Tab 1 - Cash Flow Types
export interface Expense {
  id: string;
  category: string;
  amount: number;
  color: string;
}

export interface MonthData {
  month: string;
  year: number;
  netSalary: number;
  grossSalary: number;
  expenses: Expense[];
  cumulativeCapital: number;
}

export interface CashFlowConfig {
  initialCapital: number;
  baseNetSalary: number;
  baseGrossSalary: number;
  monthsToGenerate: number;
}

export interface CashFlowData {
  initialCapital: number;
  months: MonthData[];
}

// Tab 2 - Investment Types
export interface InvestmentConfig {
  initialBalance: number;
  monthlyInvestment: number;
  annualROI: number;
  yearsToSimulate: number;
}

export interface InvestmentMonth {
  month: string;
  year: number;
  totalInvested: number;
  portfolioValue: number;
  returns: number;
}

export interface InvestmentData {
  config: InvestmentConfig;
  projections: InvestmentMonth[];
}

export type TabType = 'cashflow' | 'investments' | 'categories';
