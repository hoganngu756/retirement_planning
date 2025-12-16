# Retirement Planning Tool

A comprehensive retirement planning application built with **React**, **Next.js**, **ASP.NET Core**, and **C#**. This tool helps users make informed decisions about their retirement by providing personalized forecasts and scenario analysis powered by accurate financial calculations.

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- .NET SDK 10+

### Terminal 1: Backend API
```bash
cd api/RetirementPlanning.Api
dotnet build
dotnet run
```
Backend: http://localhost:5079

### Terminal 2: Frontend
```bash
npm install      # First time only
npm run dev
```
Frontend: http://localhost:3000

Open http://localhost:3000 in your browser and start planning!

---

## Architecture

### Services
- **Frontend:** React 19 + Next.js 16 (TypeScript) → http://localhost:3000
- **Backend:** ASP.NET Core 10 + C# → http://localhost:5079

### Data Flow
```
User Input → React Form → Validation → API Call
                                ↓
                        ASP.NET Core API
                                ↓
                      C# Calculation Service
                                ↓
                    Return Scenarios + Projections
                                ↓
                       Update React State
                                ↓
                         Render Dashboard
```

### Fallback Mechanism
If API is unavailable, the app automatically uses client-side calculations to ensure uninterrupted functionality.

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/retirement/health` | Health check |
| POST | `/api/retirement/scenarios` | Generate 3 scenarios (conservative, moderate, aggressive) |
| POST | `/api/retirement/projections` | Generate custom projections |

### Example: Generate Scenarios
**POST** `/api/retirement/scenarios`

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

---

## Development Scripts

### Frontend
```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Create production build
npm start         # Run production build
npm run lint      # Run ESLint
```

### Backend
```bash
dotnet run        # Run with debugging
dotnet build      # Compile only
dotnet publish -c Release  # Production build
```

---

## Project Structure

```
retirement_planning/
├── app/                      # React Frontend
│   ├── components/          # UI Components
│   ├── hooks/               # Custom hooks (useRetirementPlanning)
│   ├── lib/                 # Utilities
│   │   ├── calculations.ts  # Math & scenario generation
│   │   ├── validation.ts    # Form validation
│   │   └── constants.ts     # Constants & defaults
│   └── services/api.ts      # API client
├── api/                     # ASP.NET Core Backend
│   └── RetirementPlanning.Api/
│       ├── Controllers/     # API endpoints
│       ├── Services/        # Calculation service
│       ├── Models/          # Data models
│       ├── Constants/       # Scenarios & constants
│       └── Program.cs       # Startup configuration
├── public/                  # Static assets
└── package.json
```

---

## Configuration

### API URL
Frontend automatically looks for API at `http://localhost:5079/api`.

To change in production, set in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### CORS
Backend accepts requests from `http://localhost:3000` in development.

---

## Integration Details

- **Type Safety:** Full TypeScript across frontend and backend
- **Error Handling:** User-friendly error messages with API validation
- **Fallback:** Client-side calculations if API unavailable
- **Status Indicator:** Frontend shows API availability status
- **Fast Response:** API responses in 30-50ms

---

## Testing

1. Fill in user data (use default values for testing)
2. Click "Generate Forecast"
3. Open DevTools → Network tab
4. Verify POST to `/api/retirement/scenarios`
5. Check response contains scenarios and projections

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

---

## Resources

- **API Testing:** See [api/TEST-RESULTS.md](api/TEST-RESULTS.md)
- **Backend Details:** See [api/README.md](api/README.md)


