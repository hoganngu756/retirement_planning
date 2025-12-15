'use client';

import { RetirementScenario } from '@/app/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/app/lib/calculations';

interface ScenarioComparisonProps {
  scenarios: RetirementScenario[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Final Balance: {formatCurrency(data.finalBalance)}</p>
        <p className="text-sm text-gray-600">Success Rate: {data.successRate}%</p>
      </div>
    );
  }
  return null;
};

export const ScenarioComparison = ({ scenarios }: ScenarioComparisonProps) => {
  const colors = ['#ef4444', '#f59e0b', '#10b981'];

  const comparisonData = scenarios.map((scenario) => ({
    name: scenario.name,
    finalBalance: scenario.finalBalance,
    successRate: scenario.successRate,
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Scenario Comparison</h2>
        <p className="mt-1 text-sm text-gray-600">
          Projected retirement balances across different market conditions
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="finalBalance" name="Projected Balance" radius={[8, 8, 0, 0]}>
            {scenarios.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <div key={scenario.id} className="rounded-lg border border-gray-200 p-4">
            <div
              className="mb-2 h-3 w-full rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <p className="text-sm font-semibold text-gray-900">{scenario.name}</p>
            <p className="mt-2 text-xs text-gray-600">{formatCurrency(scenario.finalBalance)}</p>
            <p className="mt-1 text-xs font-medium text-green-600">
              {scenario.successRate}% success
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
