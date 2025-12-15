'use client';

import { RetirementScenario } from '@/app/types';
import { formatCurrency, formatPercentage } from '@/app/lib/calculations';
import { Check, AlertCircle } from 'lucide-react';

interface ScenarioDetailsProps {
  scenarios: RetirementScenario[];
  selectedScenarioId: string;
  onSelect: (id: string) => void;
}

export const ScenarioDetails = ({
  scenarios,
  selectedScenarioId,
  onSelect,
}: ScenarioDetailsProps) => {
  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  if (!selectedScenario) {
    return null;
  }

  const firstYear = selectedScenario.projections[0];
  const lastYear = selectedScenario.projections[selectedScenario.projections.length - 1];
  const hasPositiveBalance = lastYear && lastYear.balance > 0;

  return (
    <div className="space-y-6">
      {/* Scenario Tabs */}
      <div className="flex gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedScenarioId === scenario.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {/* Scenario Overview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">{selectedScenario.name} Scenario</h3>
          <p className="mt-1 text-sm text-gray-600">{selectedScenario.label}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Assumptions */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Market Assumptions</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Annual Return Rate</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatPercentage(selectedScenario.returnRate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Inflation Rate</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatPercentage(selectedScenario.inflationRate)}
                </p>
              </div>
            </div>
          </div>

          {/* Outcomes */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Projected Outcome</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Retirement Balance</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatCurrency(selectedScenario.finalBalance)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600">Success Rate</p>
                <div
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
                    hasPositiveBalance ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {hasPositiveBalance ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      hasPositiveBalance ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {selectedScenario.successRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year-by-Year Summary */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="mb-4 text-sm font-semibold text-gray-900">Projection Timeline</h4>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-4 gap-2 font-medium text-gray-600">
              <div>Age</div>
              <div className="text-right">Balance</div>
              <div className="text-right">Contribution</div>
              <div className="text-right">Withdrawal</div>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {selectedScenario.projections.map((projection, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-2 rounded px-2 py-1 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="font-medium text-gray-900">{projection.age}</div>
                  <div className="text-right text-gray-900">
                    {formatCurrency(projection.balance)}
                  </div>
                  <div className="text-right text-green-600">
                    {projection.contribution > 0 ? formatCurrency(projection.contribution) : '-'}
                  </div>
                  <div className="text-right text-red-600">
                    {projection.withdrawal > 0 ? formatCurrency(projection.withdrawal) : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
