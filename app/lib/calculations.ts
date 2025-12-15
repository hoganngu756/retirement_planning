import { UserFinancialData, RetirementProjection, RetirementScenario, DashboardMetrics } from '@/app/types';

// Calculate future value with compound interest
export const calculateFutureValue = (
  principal: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): number => {
  const monthlyRate = annualReturnRate / 12 / 100;
  const months = years * 12;

  let balance = principal;

  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }

  return balance;
};

// Generate retirement projections
export const generateProjections = (
  userData: UserFinancialData,
  annualReturnRate: number,
  inflationRate: number
): RetirementProjection[] => {
  const projections: RetirementProjection[] = [];
  let balance = userData.currentSavings;
  const monthlyRate = annualReturnRate / 12 / 100;
  const monthlyInflation = inflationRate / 12 / 100;
  let monthlyWithdrawal = 0;

  const yearsToRetirement = userData.retirementAge - userData.currentAge;
  const yearsInRetirement = userData.lifeExpectancy - userData.retirementAge;
  const totalMonths = (yearsToRetirement + yearsInRetirement) * 12;

  // Calculate sustainable withdrawal amount (4% rule approximation)
  const projectedBalanceAtRetirement = calculateFutureValue(
    userData.currentSavings,
    userData.monthlyContribution,
    annualReturnRate,
    yearsToRetirement
  );
  monthlyWithdrawal = (projectedBalanceAtRetirement * 0.04) / 12;

  for (let month = 0; month < totalMonths; month++) {
    const year = Math.floor(month / 12);
    const age = userData.currentAge + year;
    const isRetired = age >= userData.retirementAge;

    let contribution = 0;
    let withdrawal = 0;

    if (!isRetired) {
      contribution = userData.monthlyContribution;
    } else {
      withdrawal = monthlyWithdrawal * Math.pow(1 + monthlyInflation, month - yearsToRetirement * 12);
    }

    // Apply investment return
    const investmentReturn = balance * monthlyRate;
    balance = balance + investmentReturn + contribution - withdrawal;

    // Only store yearly data
    if (month % 12 === 0) {
      projections.push({
        year: year,
        age: age,
        balance: Math.max(0, balance),
        contribution: isRetired ? 0 : contribution * 12,
        investment_return: investmentReturn * 12,
        withdrawal: isRetired ? withdrawal * 12 : 0,
      });
    }
  }

  return projections;
};

// Create multiple scenarios for different market conditions
export const generateScenarios = (userData: UserFinancialData): RetirementScenario[] => {
  const scenarios: RetirementScenario[] = [
    {
      id: 'conservative',
      name: 'Conservative',
      label: 'Conservative (5% return, 2.5% inflation)',
      returnRate: 5,
      inflationRate: 2.5,
      projections: generateProjections(userData, 5, 2.5),
      finalBalance: 0,
      successRate: 0,
    },
    {
      id: 'moderate',
      name: 'Moderate',
      label: 'Moderate (7% return, 3% inflation)',
      returnRate: 7,
      inflationRate: 3,
      projections: generateProjections(userData, 7, 3),
      finalBalance: 0,
      successRate: 0,
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      label: 'Aggressive (9% return, 3% inflation)',
      returnRate: 9,
      inflationRate: 3,
      projections: generateProjections(userData, 9, 3),
      finalBalance: 0,
      successRate: 0,
    },
  ];

  // Calculate final metrics for each scenario
  scenarios.forEach((scenario) => {
    const lastProjection = scenario.projections[scenario.projections.length - 1];
    scenario.finalBalance = lastProjection?.balance || 0;
    scenario.successRate = scenario.finalBalance > 0 ? 95 : 45; // Simplified calculation
  });

  return scenarios;
};

// Calculate key metrics for dashboard
export const calculateMetrics = (userData: UserFinancialData, scenario: RetirementScenario): DashboardMetrics => {
  return {
    currentBalance: userData.currentSavings,
    monthlyContribution: userData.monthlyContribution,
    projectedRetirementBalance: scenario.finalBalance,
    yearsToRetirement: userData.retirementAge - userData.currentAge,
    retirementDuration: userData.lifeExpectancy - userData.retirementAge,
    successProbability: scenario.successRate,
  };
};

// Format currency for display
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage for display
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
