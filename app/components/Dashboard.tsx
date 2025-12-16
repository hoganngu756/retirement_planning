'use client';

import { UserFinancialData } from '@/app/types';
import { generateScenarios, calculateMetrics } from '@/app/lib/calculations';
import { useRetirementPlanning } from '@/app/hooks/useRetirementPlanning';
import { FinancialInputForm } from './FinancialInputForm';
import { DashboardMetrics } from './DashboardMetrics';
import { ProjectionChart } from './ProjectionChart';
import { ScenarioComparison } from './ScenarioComparison';
import { ScenarioDetails } from './ScenarioDetails';

export const Dashboard = () => {
  const { userData, scenarios, selectedScenarioId, selectedScenario, handleUserDataChange, setSelectedScenarioId } =
    useRetirementPlanning();

  const metrics = calculateMetrics(userData, selectedScenario);

  const handleSubmit = (data: UserFinancialData) => {
    handleUserDataChange(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Retirement Planning Tool</h1>
          <p className="mt-2 text-lg text-gray-600">
            Plan your future with personalized retirement forecasts and scenario analysis
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8">
          <FinancialInputForm onSubmit={handleSubmit} initialData={userData} />
        </div>

        {/* Dashboard Metrics */}
        <div className="mb-8">
          <DashboardMetrics metrics={metrics} scenario={selectedScenario} />
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Main Projection Chart */}
          <div className="lg:col-span-2">
            <ProjectionChart scenario={selectedScenario} />
          </div>

          {/* Scenario Comparison */}
          <div className="lg:col-span-2">
            <ScenarioComparison scenarios={scenarios} />
          </div>
        </div>

        {/* Scenario Details */}
        <div className="mb-8">
          <ScenarioDetails
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelect={setSelectedScenarioId}
          />
        </div>

        {/* Footer Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Disclaimer:</span> This tool provides estimates based
            on your inputs and assumptions. Actual results may vary. Consult a financial advisor for
            personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};
