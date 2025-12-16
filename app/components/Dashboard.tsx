'use client';

import { UserFinancialData } from '@/app/types';
import { calculateMetrics } from '@/app/lib/calculations';
import { useRetirementPlanning } from '@/app/hooks/useRetirementPlanning';
import { FinancialInputForm } from './FinancialInputForm';
import { DashboardMetrics } from './DashboardMetrics';
import { ProjectionChart } from './ProjectionChart';
import { ScenarioComparison } from './ScenarioComparison';
import { ScenarioDetails } from './ScenarioDetails';

export const Dashboard = () => {
  const {
    userData,
    scenarios,
    selectedScenarioId,
    selectedScenario,
    handleUserDataChange,
    setSelectedScenarioId,
    loading,
    error,
    apiAvailable,
  } = useRetirementPlanning();

  const metrics = selectedScenario ? calculateMetrics(userData, selectedScenario) : null;

  const handleSubmit = (data: UserFinancialData) => {
    handleUserDataChange(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* API Status Indicator */}
        {!apiAvailable && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Using client-side calculations (API not available)
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Retirement Planning Tool</h1>
          <p className="mt-2 text-lg text-gray-600">
            Plan your future with personalized retirement forecasts and scenario analysis
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-8">
          <FinancialInputForm
            onSubmit={handleSubmit}
            initialData={userData}
            isLoading={loading}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-8 text-center">
            <div className="inline-block">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
            </div>
            <p className="mt-4 text-blue-800 font-medium">Generating retirement scenarios...</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && scenarios.length > 0 && selectedScenario && metrics && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
