'use client';

import React, { useState } from 'react';
import { UserFinancialData } from '@/app/types';
import { ChevronDown } from 'lucide-react';
import { DEFAULT_USER_DATA, AGE_CONSTRAINTS } from '@/app/lib/constants';
import { validateFinancialData } from '@/app/lib/validation';

interface FinancialInputFormProps {
  onSubmit: (data: UserFinancialData) => void;
  initialData?: UserFinancialData;
}

export const FinancialInputForm = ({ onSubmit, initialData }: FinancialInputFormProps) => {
  const [data, setData] = useState<UserFinancialData>(initialData || DEFAULT_USER_DATA);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof UserFinancialData, value: string | number) => {
    setData((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? parseFloat(value as string) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  const errors = validateFinancialData(data);
  const isValid = Object.keys(errors).length === 0;

  const yearsToRetirement = data.retirementAge - data.currentAge;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg border border-blue-400 bg-blue-50 px-4 py-3 shadow-sm transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer group"
        aria-pressed={isExpanded}
      >
        <h2 className="text-lg font-bold text-gray-900">Financial Profile</h2>
        <ChevronDown
          className={`h-7 w-7 text-blue-500 transition-transform duration-200 group-hover:scale-125 group-hover:text-blue-700 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Current Age */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Current Age</label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => handleChange('currentAge', e.target.value)}
                min={AGE_CONSTRAINTS.minCurrentAge}
                max={AGE_CONSTRAINTS.maxCurrentAge}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.currentAge && <p className="mt-1 text-sm text-red-600">{errors.currentAge}</p>}
            </div>

            {/* Retirement Age */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Retirement Age</label>
              <input
                type="number"
                value={data.retirementAge}
                onChange={(e) => handleChange('retirementAge', e.target.value)}
                min={data.currentAge}
                max={AGE_CONSTRAINTS.maxRetirementAge}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">{yearsToRetirement} years away</p>
              {errors.retirementAge && <p className="mt-1 text-sm text-red-600">{errors.retirementAge}</p>}
            </div>

            {/* Current Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Current Annual Salary</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.currentSalary}
                  onChange={(e) => handleChange('currentSalary', e.target.value)}
                  min="0"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.currentSalary && <p className="mt-1 text-sm text-red-600">{errors.currentSalary}</p>}
              </div>
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Current Savings</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.currentSavings}
                  onChange={(e) => handleChange('currentSavings', e.target.value)}
                  min="0"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.currentSavings && <p className="mt-1 text-sm text-red-600">{errors.currentSavings}</p>}
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Monthly Contribution</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.monthlyContribution}
                  onChange={(e) => handleChange('monthlyContribution', e.target.value)}
                  min="0"
                  step="50"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.monthlyContribution && <p className="mt-1 text-sm text-red-600">{errors.monthlyContribution}</p>}
              </div>
            </div>

            {/* Life Expectancy */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Life Expectancy</label>
              <input
                type="number"
                value={data.lifeExpectancy}
                onChange={(e) => handleChange('lifeExpectancy', e.target.value)}
                min={data.retirementAge + 1}
                max={AGE_CONSTRAINTS.maxLifeExpectancy}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.lifeExpectancy && <p className="mt-1 text-sm text-red-600">{errors.lifeExpectancy}</p>}
            </div>

            {/* Risk Tolerance */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">Risk Tolerance</label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => handleChange('riskTolerance', risk)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      data.riskTolerance === risk
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {risk.charAt(0).toUpperCase() + risk.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-lg px-4 py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`}
          >
            Generate Forecast
          </button>
        </form>
      )}
    </div>
  );
};
