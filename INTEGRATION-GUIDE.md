# Frontend-Backend Integration Guide

## Overview

The ASP.NET Core API is running and ready to serve the React frontend. This guide shows how to connect the React dashboard to the API endpoints.

---

## API Server Details

**Status:** ✅ Running  
**Base URL:** `http://localhost:5079`  
**Port:** 5079

### Endpoints

1. **Health Check** - `GET /api/retirement/health`
2. **Generate Scenarios** - `POST /api/retirement/scenarios`
3. **Generate Projections** - `POST /api/retirement/projections`

---

## Integration Steps

### Step 1: Create an API Client Service

Create a new file: `app/services/api.ts`

```typescript
const API_BASE_URL = 'http://localhost:5079/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
  error?: string;
}

export const apiClient = {
  async generateScenarios(userData: UserFinancialData): Promise<RetirementScenario[]> {
    const response = await fetch(`${API_BASE_URL}/retirement/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate scenarios');
    }

    const result: ApiResponse<RetirementScenario[]> = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data || [];
  },

  async generateProjections(
    userData: UserFinancialData,
    returnRate: number,
    inflationRate: number
  ): Promise<RetirementProjection[]> {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate projections');
    }

    const result: ApiResponse<RetirementProjection[]> = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data || [];
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/retirement/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
```

### Step 2: Update the Calculation Service

Modify `app/lib/calculations.ts` to use the API:

```typescript
import { apiClient } from '@/app/services/api';

export const generateScenarios = async (userData: UserFinancialData): Promise<RetirementScenario[]> => {
  try {
    // Try to use the API if available
    return await apiClient.generateScenarios(userData);
  } catch (error) {
    console.warn('API not available, falling back to client-side calculations', error);
    // Fall back to client-side calculations if API fails
    return generateScenariosClientSide(userData);
  }
};

// Keep the original client-side implementation as fallback
const generateScenariosClientSide = (userData: UserFinancialData): RetirementScenario[] => {
  // ... existing implementation
};
```

### Step 3: Update the useRetirementPlanning Hook

Modify `app/hooks/useRetirementPlanning.ts` to use async API:

```typescript
import { useState, useEffect } from 'react';
import { UserFinancialData, RetirementScenario } from '@/app/types';
import { generateScenarios } from '@/app/lib/calculations';
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
    apiClient.healthCheck().then(setApiAvailable);
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
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
```

### Step 4: Add Loading State to Dashboard

Update `app/components/Dashboard.tsx` to show loading state:

```tsx
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
    apiAvailable 
  } = useRetirementPlanning();

  const metrics = calculateMetrics(userData, selectedScenario);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* API Status Indicator */}
        {!apiAvailable && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              API not available - using client-side calculations
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900">Retirement Planning Tool</h1>
        
        <FinancialInputForm 
          onSubmit={handleUserDataChange} 
          initialData={userData}
          isLoading={loading}
        />

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Generating scenarios...</p>
          </div>
        )}

        {!loading && scenarios.length > 0 && (
          <>
            <DashboardMetrics metrics={metrics} scenario={selectedScenario} />
            <ProjectionChart scenario={selectedScenario} />
            <ScenarioComparison scenarios={scenarios} />
            <ScenarioDetails 
              scenarios={scenarios}
              selectedScenarioId={selectedScenarioId}
              onSelect={setSelectedScenarioId}
            />
          </>
        )}
      </div>
    </div>
  );
};
```

---

## Configuration

### Development Environment

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5079

### Production Deployment

When deploying to production:

1. Update `API_BASE_URL` in `app/services/api.ts` to your production URL
2. Update CORS policy in backend `Program.cs` to allow your frontend domain
3. Consider using environment variables for the API URL

Example `app/services/api.ts` with environment variables:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5079/api';
```

Then set in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.yourapp.com
```

---

## Error Handling

The API client provides detailed error messages. Common errors:

| Error | Cause | Solution |
|-------|-------|----------|
| Failed to fetch | API not running | Start backend with `dotnet run` |
| 400 Bad Request | Invalid input | Check validation in Dashboard |
| 500 Internal Server Error | Server error | Check backend logs |
| Network error | CORS issue | Verify CORS config in Program.cs |

---

## Testing the Integration

1. Start the backend: `cd api/RetirementPlanning.Api && dotnet run`
2. Start the frontend: `cd . && npm run dev`
3. Open http://localhost:3000 in browser
4. Fill in user data and submit form
5. Check browser DevTools → Network tab to see API calls
6. Verify scenarios are generated from the API

---

## Next Steps

After successful integration:
1. Add database persistence
2. Implement user authentication
3. Add API caching for performance
4. Create unit/integration tests
5. Set up CI/CD pipeline

---

## Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
