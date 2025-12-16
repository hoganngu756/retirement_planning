Write-Host "Advanced API Testing..." -ForegroundColor Green
Write-Host ""

# Test 1: Custom Projections
Write-Host "1. Testing Custom Projections Endpoint" -ForegroundColor Cyan
$projectionBody = '{
  "userFinancialData": {
    "currentAge": 35,
    "retirementAge": 65,
    "currentSalary": 75000,
    "currentSavings": 150000,
    "monthlyContribution": 1000,
    "lifeExpectancy": 90,
    "riskTolerance": "moderate"
  },
  "returnRate": 7.5,
  "inflationRate": 2.8
}'

try {
    $projections = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/projections" `
        -Method Post `
        -ContentType "application/json" `
        -Body $projectionBody
    
    if ($projections.success) {
        Write-Host "Successfully generated custom projections" -ForegroundColor Green
        Write-Host "Total years: $($projections.data.Count)" -ForegroundColor Green
        Write-Host "First year (Age $($projections.data[0].age)): Balance = $($projections.data[0].balance)" -ForegroundColor Gray
        Write-Host "Last year (Age $($projections.data[-1].age)): Balance = $($projections.data[-1].balance)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Validation - Invalid Age
Write-Host "2. Testing Validation - Invalid Current Age" -ForegroundColor Cyan
$invalidBody = '{
  "currentAge": 10,
  "retirementAge": 65,
  "currentSalary": 75000,
  "currentSavings": 150000,
  "monthlyContribution": 1000,
  "lifeExpectancy": 90,
  "riskTolerance": "moderate"
}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/scenarios" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidBody -ErrorAction Stop
    Write-Host "Unexpected success" -ForegroundColor Red
}
catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "Correctly rejected invalid age" -ForegroundColor Green
        $error = $_ | ConvertFrom-Json
        Write-Host "Error details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}

Write-Host ""

# Test 3: Validation - Negative Savings
Write-Host "3. Testing Validation - Negative Savings" -ForegroundColor Cyan
$invalidBody2 = '{
  "currentAge": 35,
  "retirementAge": 65,
  "currentSalary": 75000,
  "currentSavings": -50000,
  "monthlyContribution": 1000,
  "lifeExpectancy": 90,
  "riskTolerance": "moderate"
}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/scenarios" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidBody2 -ErrorAction Stop
    Write-Host "Unexpected success" -ForegroundColor Red
}
catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "Correctly rejected negative savings" -ForegroundColor Green
        Write-Host "Error details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Advanced Testing Complete!" -ForegroundColor Green
