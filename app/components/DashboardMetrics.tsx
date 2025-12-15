'use client';

import { UserFinancialData, RetirementScenario, DashboardMetrics as DashboardMetricsType } from '@/app/types';
import { formatCurrency, formatPercentage } from '@/app/lib/calculations';
import { TrendingUp, Target, Calendar, Percent } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
  highlight?: boolean;
}

const MetricCard = ({ label, value, icon, subtext, highlight }: MetricsCardProps) => {
  return (
    <div
      className={`rounded-lg p-6 ${
        highlight
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-900'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${highlight ? 'text-blue-100' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subtext && (
            <p className={`mt-1 text-xs ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
              {subtext}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${highlight ? 'bg-blue-400 bg-opacity-30' : 'bg-gray-100'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
  scenario: RetirementScenario;
}

export const DashboardMetrics = ({ metrics, scenario }: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Current Savings"
        value={formatCurrency(metrics.currentBalance)}
        icon={<Target className="h-6 w-6" />}
        subtext="Your retirement fund balance"
      />

      <MetricCard
        label="Monthly Contribution"
        value={formatCurrency(metrics.monthlyContribution)}
        icon={<TrendingUp className="h-6 w-6" />}
        subtext="Regular investment amount"
      />

      <MetricCard
        label="Years to Retirement"
        value={metrics.yearsToRetirement}
        icon={<Calendar className="h-6 w-6" />}
        subtext={`Retiring at ${scenario.projections[0]?.age || 'TBD'}`}
      />

      <MetricCard
        label="Projected Balance"
        value={formatCurrency(metrics.projectedRetirementBalance)}
        icon={<Percent className="h-6 w-6" />}
        subtext={`${scenario.successRate}% success rate`}
        highlight
      />
    </div>
  );
};
