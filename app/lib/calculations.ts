import { UserFinancialData, RetirementProjection, RetirementScenario, DashboardMetrics } from '@/app/types';
import {
  WITHDRAWAL_RATE,
  MONTHS_PER_YEAR,
  ANNUAL_TO_MONTHLY_DIVISOR,
  SCENARIOS,
  SUCCESS_RATES,
} from './constants';

// Calculate future value with compound interest
export const calculateFutureValue = (
  principal: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): number => {
  const monthlyRate = annualReturnRate / MONTHS_PER_YEAR / ANNUAL_TO_MONTHLY_DIVISOR;
  const months = years * MONTHS_PER_YEAR;

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
  const monthlyRate = annualReturnRate / MONTHS_PER_YEAR / ANNUAL_TO_MONTHLY_DIVISOR;
  const monthlyInflation = inflationRate / MONTHS_PER_YEAR / ANNUAL_TO_MONTHLY_DIVISOR;
  let monthlyWithdrawal = 0;

  const yearsToRetirement = userData.retirementAge - userData.currentAge;
  const yearsInRetirement = userData.lifeExpectancy - userData.retirementAge;
  const totalMonths = (yearsToRetirement + yearsInRetirement) * MONTHS_PER_YEAR;

  // Calculate sustainable withdrawal amount (4% rule approximation)
  const projectedBalanceAtRetirement = calculateFutureValue(
    userData.currentSavings,
    userData.monthlyContribution,
    annualReturnRate,
    yearsToRetirement
  );
  monthlyWithdrawal = (projectedBalanceAtRetirement * WITHDRAWAL_RATE) / MONTHS_PER_YEAR;

  for (let month = 0; month < totalMonths; month++) {
    const year = Math.floor(month / MONTHS_PER_YEAR);
    const age = userData.currentAge + year;
    const isRetired = age >= userData.retirementAge;

    let contribution = 0;
    let withdrawal = 0;

    if (!isRetired) {
      contribution = userData.monthlyContribution;
    } else {
      withdrawal = monthlyWithdrawal * Math.pow(1 + monthlyInflation, month - yearsToRetirement * MONTHS_PER_YEAR);
    }

    // Apply investment return
    const investmentReturn = balance * monthlyRate;
    balance = balance + investmentReturn + contribution - withdrawal;

    // Only store yearly data
    if (month % MONTHS_PER_YEAR === 0) {
      projections.push({
        year: year,
        age: age,
        balance: Math.max(0, balance),
        contribution: isRetired ? 0 : contribution * MONTHS_PER_YEAR,
        investment_return: investmentReturn * MONTHS_PER_YEAR,
        withdrawal: isRetired ? withdrawal * MONTHS_PER_YEAR : 0,
      });
    }
  }

  return projections;
};

// Create multiple scenarios for different market conditions
export const generateScenarios = (userData: UserFinancialData): RetirementScenario[] => {
  const scenarios: RetirementScenario[] = SCENARIOS.map((scenarioConfig) => ({
    id: scenarioConfig.id,
    name: scenarioConfig.name,
    label: scenarioConfig.label,
    returnRate: scenarioConfig.returnRate,
    inflationRate: scenarioConfig.inflationRate,
    projections: generateProjections(userData, scenarioConfig.returnRate, scenarioConfig.inflationRate),
    finalBalance: 0,
    successRate: 0,
  }));

  // Calculate final metrics for each scenario
  scenarios.forEach((scenario) => {
    const lastProjection = scenario.projections[scenario.projections.length - 1];
    scenario.finalBalance = lastProjection?.balance || 0;
    scenario.successRate = scenario.finalBalance > 0 ? SUCCESS_RATES.success : SUCCESS_RATES.failure;
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
