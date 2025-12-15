'use client';

import React, { useState } from 'react';
import { UserFinancialData } from '@/app/types';
import { ChevronDown } from 'lucide-react';

interface FinancialInputFormProps {
  onSubmit: (data: UserFinancialData) => void;
  initialData?: UserFinancialData;
}

const defaultData: UserFinancialData = {
  currentAge: 35,
  retirementAge: 65,
  currentSalary: 75000,
  currentSavings: 150000,
  monthlyContribution: 1000,
  lifeExpectancy: 90,
  riskTolerance: 'moderate',
};

export const FinancialInputForm = ({ onSubmit, initialData }: FinancialInputFormProps) => {
  const [data, setData] = useState<UserFinancialData>(initialData || defaultData);
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

  const yearsToRetirement = data.retirementAge - data.currentAge;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between"
      >
        <h2 className="text-lg font-bold text-gray-900">Financial Profile</h2>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                min="18"
                max="100"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Retirement Age */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Retirement Age</label>
              <input
                type="number"
                value={data.retirementAge}
                onChange={(e) => handleChange('retirementAge', e.target.value)}
                min={data.currentAge}
                max="100"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">{yearsToRetirement} years away</p>
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
                max="120"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
            className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Forecast
          </button>
        </form>
      )}
    </div>
  );
};
