$body = '{
  "currentAge": 35,
  "retirementAge": 65,
  "currentSalary": 75000,
  "currentSavings": 150000,
  "monthlyContribution": 1000,
  "lifeExpectancy": 90,
  "riskTolerance": "moderate"
}'

Write-Host "Testing API Endpoints..." -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check Endpoint" -ForegroundColor Cyan
$health = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/health" -Method Get
Write-Host "Status: $($health.status)" -ForegroundColor Green
Write-Host ""

# Test 2: Generate Scenarios
Write-Host "2. Testing Scenario Generation Endpoint" -ForegroundColor Cyan
try {
    $scenarios = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/scenarios" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    if ($scenarios.success) {
        Write-Host "Successfully generated scenarios" -ForegroundColor Green
        Write-Host "Number of scenarios: $($scenarios.data.Count)" -ForegroundColor Green
        
        foreach ($scenario in $scenarios.data) {
            Write-Host "  - $($scenario.name): Return $($scenario.returnRate)%, Inflation $($scenario.inflationRate)%" -ForegroundColor Green
            Write-Host "    Final Balance: $($scenario.finalBalance)" -ForegroundColor Gray
            Write-Host "    Success Rate: $($scenario.successRate)%" -ForegroundColor Gray
            Write-Host "    Projections: $($scenario.projections.Count) years" -ForegroundColor Gray
        }
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "API Testing Complete!" -ForegroundColor Green
