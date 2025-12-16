# Retirement Planning Tool

A comprehensive retirement planning application built with **React**, **Next.js**, **ASP.NET Core**, and **C#**. This tool helps users make informed decisions about their retirement by providing personalized forecasts and scenario analysis powered by accurate financial calculations.

## Project Overview

### Frontend Setup

```bash
cd /path/to/retirement_planning
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

```bash
cd api/RetirementPlanning.Api
dotnet build
dotnet run
```

The API will start on [http://localhost:5079](http://localhost:5079)

### Both Services Running

You'll have:
- **Frontend:** http://localhost:3000 (React Dashboard)
- **Backend:** http://localhost:5079 (ASP.NET Core API)

---

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm start         # Run production build
npm run lint      # Run ESLint
```

## Backend API

### Running the API

```bash
cd api/RetirementPlanning.Api
dotnet run
```

### API Endpoints

#### 1. Generate Retirement Scenarios
```
POST /api/retirement/scenarios
```
Generates three retirement scenarios based on user financial data.

**Request:**
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
      "scenarioId": "conservative",
      "name": "Conservative",
      "returnRate": 5.0,
      "inflationRate": 2.5,
      "finalBalance": 1388614.07,
      "successRate": 95.0,
      "projections": [...]
    },
    ...
  ]
}
```

#### 2. Generate Custom Projections
```
POST /api/retirement/projections
```
Generates projections with specific return and inflation rates.

#### 3. Health Check
```
GET /api/retirement/health
```
Verifies API is running and healthy.

For detailed API documentation, see [api/README.md](api/README.md)

---

## Integration

The frontend is configured to communicate with the backend API. By default:
- Frontend calls API at `http://localhost:5079/api`
- API accepts CORS requests from `http://localhost:3000`

For integration details, see [INTEGRATION-GUIDE.md](INTEGRATION-GUIDE.md)

---

## Production Build

### Frontend
```bash
npm run build
npm start
```

### Backend
```bash
cd api/RetirementPlanning.Api
dotnet publish -c Release
```


