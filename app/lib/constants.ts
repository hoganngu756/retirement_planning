// Default user financial profile
export const DEFAULT_USER_DATA = {
  currentAge: 35,
  retirementAge: 65,
  currentSalary: 75000,
  currentSavings: 150000,
  monthlyContribution: 1000,
  lifeExpectancy: 90,
  riskTolerance: 'moderate' as const,
};

// Withdrawal rule for retirement (4% rule)
export const WITHDRAWAL_RATE = 0.04;

// Monthly conversion factor for annual rates
export const MONTHS_PER_YEAR = 12;
export const ANNUAL_TO_MONTHLY_DIVISOR = 100;

// Scenario configurations
export const SCENARIOS = [
  {
    id: 'conservative',
    name: 'Conservative',
    label: 'Conservative (5% return, 2.5% inflation)',
    returnRate: 5,
    inflationRate: 2.5,
  },
  {
    id: 'moderate',
    name: 'Moderate',
    label: 'Moderate (7% return, 3% inflation)',
    returnRate: 7,
    inflationRate: 3,
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    label: 'Aggressive (9% return, 3% inflation)',
    returnRate: 9,
    inflationRate: 3,
  },
] as const;

// Success rate thresholds
export const SUCCESS_RATES = {
  success: 95,
  failure: 45,
} as const;

// Age validation constraints
export const AGE_CONSTRAINTS = {
  minCurrentAge: 18,
  maxCurrentAge: 100,
  maxRetirementAge: 100,
  maxLifeExpectancy: 120,
} as const;
