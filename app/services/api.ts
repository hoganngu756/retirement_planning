import { UserFinancialData, RetirementProjection, RetirementScenario } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5079/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  error?: string;
}

/**
 * API client for communicating with the ASP.NET Core backend.
 */
export const apiClient = {
  /**
   * Generate all three retirement scenarios based on user financial data.
   */
  async generateScenarios(userData: UserFinancialData): Promise<RetirementScenario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/retirement/scenarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.errors 
            ? Object.values(error.errors).join(', ')
            : error.error || `HTTP ${response.status}`
        );
      }

      const result: ApiResponse<RetirementScenario[]> = await response.json();
      if (!result.success || !result.data) {
        throw new Error('API returned unsuccessful response');
      }

      return result.data;
    } catch (error) {
      console.error('Error generating scenarios:', error);
      throw error;
    }
  },

  /**
   * Generate custom projections for specific return and inflation rates.
   */
  async generateProjections(
    userData: UserFinancialData,
    returnRate: number,
    inflationRate: number
  ): Promise<RetirementProjection[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/retirement/projections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userFinancialData: userData,
          returnRate,
          inflationRate,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const result: ApiResponse<RetirementProjection[]> = await response.json();
      if (!result.success || !result.data) {
        throw new Error('API returned unsuccessful response');
      }

      return result.data;
    } catch (error) {
      console.error('Error generating projections:', error);
      throw error;
    }
  },

  /**
   * Check if the API is available and healthy.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/retirement/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
