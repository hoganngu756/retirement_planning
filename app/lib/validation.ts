import { UserFinancialData } from '@/app/types';
import { AGE_CONSTRAINTS } from '@/app/lib/constants';

export const validateFinancialData = (
  data: UserFinancialData
): Partial<Record<keyof UserFinancialData, string>> => {
  const errors: Partial<Record<keyof UserFinancialData, string>> = {};

  if (!data.currentAge || data.currentAge < AGE_CONSTRAINTS.minCurrentAge) {
    errors.currentAge = `Current age must be at least ${AGE_CONSTRAINTS.minCurrentAge}.`;
  }

  if (!data.retirementAge || data.retirementAge <= data.currentAge) {
    errors.retirementAge = 'Retirement age must be greater than current age.';
  }

  if (data.lifeExpectancy <= data.retirementAge) {
    errors.lifeExpectancy = 'Life expectancy must be greater than retirement age.';
  }

  if (data.currentSalary < 0) {
    errors.currentSalary = 'Salary cannot be negative.';
  }

  if (data.currentSavings < 0) {
    errors.currentSavings = 'Savings cannot be negative.';
  }

  if (data.monthlyContribution < 0) {
    errors.monthlyContribution = 'Monthly contribution cannot be negative.';
  }

  return errors;
};
