import { useState } from 'react';
import { UserFinancialData, RetirementScenario } from '@/app/types';
import { generateScenarios } from '@/app/lib/calculations';
import { DEFAULT_USER_DATA } from '@/app/lib/constants';

export const useRetirementPlanning = () => {
  const [userData, setUserData] = useState<UserFinancialData>(DEFAULT_USER_DATA);
  const [scenarios, setScenarios] = useState<RetirementScenario[]>(() =>
    generateScenarios(DEFAULT_USER_DATA)
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('moderate');

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[1];

  const handleUserDataChange = (data: UserFinancialData) => {
    setUserData(data);
    const newScenarios = generateScenarios(data);
    setScenarios(newScenarios);
    setSelectedScenarioId('moderate');
  };

  return {
    userData,
    scenarios,
    selectedScenarioId,
    selectedScenario,
    handleUserDataChange,
    setSelectedScenarioId,
  };
};
