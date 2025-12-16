using RetirementPlanning.Api.Constants;
using RetirementPlanning.Api.Models;

namespace RetirementPlanning.Api.Services;

/// <summary>
/// Service for calculating retirement projections.
/// </summary>
public interface ICalculationService
{
    /// <summary>
    /// Calculates future value with compound interest.
    /// </summary>
    decimal CalculateFutureValue(
        decimal principal,
        decimal monthlyContribution,
        decimal annualReturnRate,
        int years);
    
    /// <summary>
    /// Generates year-by-year retirement projections for a given scenario.
    /// </summary>
    List<RetirementProjection> GenerateProjections(
        UserFinancialData userData,
        decimal annualReturnRate,
        decimal inflationRate);
    
    /// <summary>
    /// Generates all three retirement scenarios (conservative, moderate, aggressive).
    /// </summary>
    List<RetirementScenario> GenerateScenarios(UserFinancialData userData);
}

/// <summary>
/// Implementation of retirement calculation service.
/// </summary>
public class CalculationService : ICalculationService
{
    public decimal CalculateFutureValue(
        decimal principal,
        decimal monthlyContribution,
        decimal annualReturnRate,
        int years)
    {
        var monthlyRate = annualReturnRate / CalculationConstants.MonthsPerYear / CalculationConstants.AnnualToMonthlyDivisor;
        var months = years * CalculationConstants.MonthsPerYear;
        
        var balance = principal;
        
        for (int i = 0; i < months; i++)
        {
            balance = balance * (1 + monthlyRate) + monthlyContribution;
        }
        
        return balance;
    }
    
    public List<RetirementProjection> GenerateProjections(
        UserFinancialData userData,
        decimal annualReturnRate,
        decimal inflationRate)
    {
        var projections = new List<RetirementProjection>();
        var balance = userData.CurrentSavings;
        
        var monthlyRate = annualReturnRate / CalculationConstants.MonthsPerYear / CalculationConstants.AnnualToMonthlyDivisor;
        var monthlyInflation = inflationRate / CalculationConstants.MonthsPerYear / CalculationConstants.AnnualToMonthlyDivisor;
        decimal monthlyWithdrawal = 0;
        
        var yearsToRetirement = userData.RetirementAge - userData.CurrentAge;
        var yearsInRetirement = userData.LifeExpectancy - userData.RetirementAge;
        var totalMonths = (yearsToRetirement + yearsInRetirement) * CalculationConstants.MonthsPerYear;
        
        // Calculate sustainable withdrawal amount (4% rule)
        var projectedBalanceAtRetirement = CalculateFutureValue(
            userData.CurrentSavings,
            userData.MonthlyContribution,
            annualReturnRate,
            yearsToRetirement);
        monthlyWithdrawal = (projectedBalanceAtRetirement * CalculationConstants.WithdrawalRate) / CalculationConstants.MonthsPerYear;
        
        for (int month = 0; month < totalMonths; month++)
        {
            var year = month / CalculationConstants.MonthsPerYear;
            var age = userData.CurrentAge + year;
            var isRetired = age >= userData.RetirementAge;
            
            decimal contribution = 0;
            decimal withdrawal = 0;
            
            if (!isRetired)
            {
                contribution = userData.MonthlyContribution;
            }
            else
            {
                var monthsSinceRetirement = month - (yearsToRetirement * CalculationConstants.MonthsPerYear);
                withdrawal = monthlyWithdrawal * (decimal)Math.Pow((double)(1 + monthlyInflation), monthsSinceRetirement);
            }
            
            // Apply investment return
            var investmentReturn = balance * monthlyRate;
            balance = balance + investmentReturn + contribution - withdrawal;
            
            // Store yearly data
            if (month % CalculationConstants.MonthsPerYear == 0)
            {
                projections.Add(new RetirementProjection
                {
                    Year = year,
                    Age = age,
                    Balance = Math.Max(0, balance),
                    Contribution = isRetired ? 0 : contribution * CalculationConstants.MonthsPerYear,
                    InvestmentReturn = investmentReturn * CalculationConstants.MonthsPerYear,
                    Withdrawal = isRetired ? withdrawal * CalculationConstants.MonthsPerYear : 0
                });
            }
        }
        
        return projections;
    }
    
    public List<RetirementScenario> GenerateScenarios(UserFinancialData userData)
    {
        var scenarios = new List<RetirementScenario>();
        
        foreach (var config in ScenarioConfigs.GetAllScenarios())
        {
            var projections = GenerateProjections(userData, config.ReturnRate, config.InflationRate);
            
            var scenario = new RetirementScenario
            {
                ScenarioId = config.Id,
                Name = config.Name,
                Label = config.Label,
                ReturnRate = config.ReturnRate,
                InflationRate = config.InflationRate,
                Projections = projections,
                UserFinancialDataId = userData.Id
            };
            
            // Calculate final metrics
            var lastProjection = projections.LastOrDefault();
            if (lastProjection != null)
            {
                scenario.FinalBalance = lastProjection.Balance;
                scenario.SuccessRate = scenario.FinalBalance > 0
                    ? CalculationConstants.SuccessRatePositive
                    : CalculationConstants.SuccessRateNegative;
            }
            
            scenarios.Add(scenario);
        }
        
        return scenarios;
    }
}
