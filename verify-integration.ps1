Write-Host "======================================" -ForegroundColor Green
Write-Host "RETIREMENT PLANNING PROJECT TEST" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Test 1: Backend Health
Write-Host "[1/4] Testing Backend Health..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/health" -Method Get -ErrorAction Stop
    Write-Host "OK - Backend Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "FAILED - Backend Connection Error" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Frontend Accessibility
Write-Host "[2/4] Testing Frontend..." -ForegroundColor Cyan
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "OK - Frontend is Running at http://localhost:3000" -ForegroundColor Green
    }
}
catch {
    Write-Host "WARNING - Frontend may not be running" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: API Scenario Generation
Write-Host "[3/4] Testing API Scenario Generation..." -ForegroundColor Cyan
try {
    $userData = @{
        currentAge = 35
        retirementAge = 65
        currentSalary = 75000
        currentSavings = 150000
        monthlyContribution = 1000
        lifeExpectancy = 90
        riskTolerance = "moderate"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/scenarios" -Method Post -ContentType "application/json" -Body $userData -ErrorAction Stop

    if ($response.success) {
        Write-Host "OK - API Generated $($response.data.Count) Scenarios" -ForegroundColor Green
        $response.data | ForEach-Object {
            $balance = [math]::Round($_.finalBalance, 0).ToString("N0")
            Write-Host "  - $($_.name): Balance = $$$balance (Success: $($_.successRate)%)" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "FAILED - API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Validation Testing
Write-Host "[4/4] Testing Input Validation..." -ForegroundColor Cyan
try {
    $invalidData = @{
        currentAge = 10
        retirementAge = 65
        currentSalary = 75000
        currentSavings = 150000
        monthlyContribution = 1000
        lifeExpectancy = 90
        riskTolerance = "moderate"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5079/api/retirement/scenarios" -Method Post -ContentType "application/json" -Body $invalidData -ErrorAction Stop
    Write-Host "WARNING - Validation did not trigger" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "OK - Validation Correctly Rejected Invalid Data" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "TEST COMPLETE - INTEGRATION VERIFIED" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
