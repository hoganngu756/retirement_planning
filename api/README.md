# Retirement Planning API - Backend Documentation

## Overview
This is the ASP.NET Core Web API backend for the Retirement Planning Tool. It provides endpoints for generating retirement scenarios and projections based on user financial data.

## Project Structure

```
RetirementPlanning.Api/
├── Controllers/           # API endpoints
├── Models/               # Data models
├── Services/             # Business logic
├── Constants/            # Constants and configurations
├── Program.cs            # Application startup
└── RetirementPlanning.Api.csproj
```

## Running the API

### Development
```bash
cd api/RetirementPlanning.Api
dotnet run
```

The API will start on `https://localhost:7213` and `http://localhost:5213` by default.

### Build
```bash
dotnet build
```

## API Endpoints

### 1. Generate Retirement Scenarios
**POST** `/api/retirement/scenarios`

Generates three retirement scenarios (conservative, moderate, aggressive) based on user financial data.

**Request Body:**
```json
{
  "currentAge": 35,
  "retirementAge": 65,
  "currentSalary": 75000,
  "currentSavings": 150000,
  "monthlyContribution": 1000,
  "lifeExpectancy": 90,
  "riskTolerance": "moderate"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "scenarioId": "conservative",
      "name": "Conservative",
      "label": "Conservative (5% return, 2.5% inflation)",
      "returnRate": 5.0,
      "inflationRate": 2.5,
      "finalBalance": 1250000,
      "successRate": 95.0,
      "projections": [
        {
          "id": 0,
          "year": 0,
          "age": 35,
          "balance": 150000,
          "contribution": 12000,
          "investmentReturn": 7500,
          "withdrawal": 0
        },
        ...
      ]
    },
    ...
  ]
}
```

### 2. Generate Custom Projections
**POST** `/api/retirement/projections`

Generates year-by-year projections for a specific return rate and inflation rate scenario.

**Request Body:**
```json
{
  "userFinancialData": {
    "currentAge": 35,
    "retirementAge": 65,
    "currentSalary": 75000,
    "currentSavings": 150000,
    "monthlyContribution": 1000,
    "lifeExpectancy": 90,
    "riskTolerance": "moderate"
  },
  "returnRate": 7.0,
  "inflationRate": 3.0
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "year": 0,
      "age": 35,
      "balance": 150000,
      "contribution": 12000,
      "investmentReturn": 8750,
      "withdrawal": 0
    },
    ...
  ]
}
```

### 3. Health Check
**GET** `/api/retirement/health`

Simple health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-16T15:30:00Z"
}
```

## Models

### UserFinancialData
```csharp
public class UserFinancialData
{
    public int Id { get; set; }
    public int CurrentAge { get; set; }
    public int RetirementAge { get; set; }
    public decimal CurrentSalary { get; set; }
    public decimal CurrentSavings { get; set; }
    public decimal MonthlyContribution { get; set; }
    public int LifeExpectancy { get; set; }
    public string RiskTolerance { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### RetirementScenario
```csharp
public class RetirementScenario
{
    public int Id { get; set; }
    public string ScenarioId { get; set; }
    public string Name { get; set; }
    public string Label { get; set; }
    public decimal ReturnRate { get; set; }
    public decimal InflationRate { get; set; }
    public decimal FinalBalance { get; set; }
    public decimal SuccessRate { get; set; }
    public ICollection<RetirementProjection> Projections { get; set; }
}
```

### RetirementProjection
```csharp
public class RetirementProjection
{
    public int Id { get; set; }
    public int Year { get; set; }
    public int Age { get; set; }
    public decimal Balance { get; set; }
    public decimal Contribution { get; set; }
    public decimal InvestmentReturn { get; set; }
    public decimal Withdrawal { get; set; }
}
```

## Services

### CalculationService
Handles all retirement calculation logic:
- `CalculateFutureValue()` - Compound interest calculations
- `GenerateProjections()` - Year-by-year projection generation
- `GenerateScenarios()` - Generate all three scenarios

### ValidationService
Validates user financial data:
- Age constraints validation
- Salary/savings validation
- Risk tolerance validation

## Constants

### CalculationConstants
- `WithdrawalRate` = 0.04 (4% rule)
- `MonthsPerYear` = 12
- `AnnualToMonthlyDivisor` = 100
- `SuccessRatePositive` = 95%
- `SuccessRateNegative` = 45%

### ScenarioConfigs
Three predefined scenarios:
1. **Conservative**: 5% return, 2.5% inflation
2. **Moderate**: 7% return, 3% inflation
3. **Aggressive**: 9% return, 3% inflation

## CORS Configuration
The API is configured to accept requests from:
- `http://localhost:3000` (React frontend)

Update the CORS policy in `Program.cs` when deploying to production.

## Next Steps
- [ ] Implement SQL Server database integration
- [ ] Add Entity Framework Core migrations
- [ ] Implement user authentication
- [ ] Add persistence layer for user scenarios
- [ ] Add caching layer
- [ ] Implement market trends data source
