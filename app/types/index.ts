export interface UserFinancialData {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  currentSavings: number;
  monthlyContribution: number;
  lifeExpectancy: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface RetirementProjection {
  year: number;
  age: number;
  balance: number;
  contribution: number;
  investment_return: number;
  withdrawal: number;
}

export interface RetirementScenario {
  id: string;
  name: string;
  label: string;
  returnRate: number;
  inflationRate: number;
  projections: RetirementProjection[];
  finalBalance: number;
  successRate: number;
}

export interface DashboardMetrics {
  currentBalance: number;
  monthlyContribution: number;
  projectedRetirementBalance: number;
  yearsToRetirement: number;
  retirementDuration: number;
  successProbability: number;
}
