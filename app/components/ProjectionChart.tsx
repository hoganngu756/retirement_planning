'use client';

import { RetirementScenario } from '@/app/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/app/lib/calculations';

interface ProjectionChartProps {
  scenario: RetirementScenario;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">Age {data.age}</p>
        <p className="text-sm text-gray-600">Balance: {formatCurrency(data.balance)}</p>
        {data.contribution > 0 && (
          <p className="text-xs text-green-600">Contribution: {formatCurrency(data.contribution)}</p>
        )}
        {data.withdrawal > 0 && (
          <p className="text-xs text-red-600">Withdrawal: {formatCurrency(data.withdrawal)}</p>
        )}
      </div>
    );
  }
  return null;
};

export const ProjectionChart = ({ scenario }: ProjectionChartProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">{scenario.name} Scenario</h2>
        <p className="mt-1 text-sm text-gray-600">{scenario.label}</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={scenario.projections}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="age"
            label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Account Balance"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-600">Return Rate</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{scenario.returnRate}%</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-600">Inflation Rate</p>
          <p className="mt-2 text-xl font-bold text-gray-900">{scenario.inflationRate}%</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-600">Success Rate</p>
          <p className="mt-2 text-xl font-bold text-green-600">{scenario.successRate}%</p>
        </div>
      </div>
    </div>
  );
};
