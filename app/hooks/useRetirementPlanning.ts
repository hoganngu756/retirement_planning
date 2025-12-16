import { useEffect, useState } from 'react';
import { UserFinancialData, RetirementScenario } from '@/app/types';
import { generateScenarios, calculateMetrics } from '@/app/lib/calculations';
import { DEFAULT_USER_DATA } from '@/app/lib/constants';
import { apiClient } from '@/app/services/api';

export const useRetirementPlanning = () => {
  const [userData, setUserData] = useState<UserFinancialData>(DEFAULT_USER_DATA);
  const [scenarios, setScenarios] = useState<RetirementScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);

  // Check API availability on mount
  useEffect(() => {
    const checkApi = async () => {
      const available = await apiClient.healthCheck();
      setApiAvailable(available);
    };
    checkApi();
  }, []);

  // Initialize with default scenarios
  useEffect(() => {
    const initializeScenarios = async () => {
      try {
        const initialScenarios = await generateScenarios(DEFAULT_USER_DATA);
        setScenarios(initialScenarios);
      } catch (err) {
        console.error('Failed to initialize scenarios:', err);
      }
    };
    initializeScenarios();
  }, []);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[1];

  const handleUserDataChange = async (data: UserFinancialData) => {
    setUserData(data);
    setLoading(true);
    setError(null);

    try {
      const newScenarios = await generateScenarios(data);
      setScenarios(newScenarios);
      setSelectedScenarioId('moderate');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate scenarios';
      setError(errorMessage);
      console.error('Error generating scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    scenarios,
    selectedScenarioId,
    selectedScenario,
    handleUserDataChange,
    setSelectedScenarioId,
    loading,
    error,
    apiAvailable,
  };
};
