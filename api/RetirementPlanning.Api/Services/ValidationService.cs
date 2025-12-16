using RetirementPlanning.Api.Constants;
using RetirementPlanning.Api.Models;

namespace RetirementPlanning.Api.Services;

/// <summary>
/// Service for validating financial data.
/// </summary>
public interface IValidationService
{
    /// <summary>
    /// Validates user financial data and returns any validation errors.
    /// </summary>
    ValidationResult Validate(UserFinancialData data);
}

/// <summary>
/// Result of validation with any errors.
/// </summary>
public class ValidationResult
{
    public bool IsValid { get; set; } = true;
    public Dictionary<string, string> Errors { get; set; } = new();
}

/// <summary>
/// Implementation of financial data validation service.
/// </summary>
public class ValidationService : IValidationService
{
    public ValidationResult Validate(UserFinancialData data)
    {
        var result = new ValidationResult();
        
        // Validate current age
        if (data.CurrentAge < AgeConstraints.MinCurrentAge)
        {
            result.Errors["CurrentAge"] = $"Current age must be at least {AgeConstraints.MinCurrentAge}.";
        }
        if (data.CurrentAge > AgeConstraints.MaxCurrentAge)
        {
            result.Errors["CurrentAge"] = $"Current age cannot exceed {AgeConstraints.MaxCurrentAge}.";
        }
        
        // Validate retirement age
        if (data.RetirementAge <= data.CurrentAge)
        {
            result.Errors["RetirementAge"] = "Retirement age must be greater than current age.";
        }
        if (data.RetirementAge > AgeConstraints.MaxRetirementAge)
        {
            result.Errors["RetirementAge"] = $"Retirement age cannot exceed {AgeConstraints.MaxRetirementAge}.";
        }
        
        // Validate life expectancy
        if (data.LifeExpectancy <= data.RetirementAge)
        {
            result.Errors["LifeExpectancy"] = "Life expectancy must be greater than retirement age.";
        }
        if (data.LifeExpectancy > AgeConstraints.MaxLifeExpectancy)
        {
            result.Errors["LifeExpectancy"] = $"Life expectancy cannot exceed {AgeConstraints.MaxLifeExpectancy}.";
        }
        
        // Validate salary
        if (data.CurrentSalary < 0)
        {
            result.Errors["CurrentSalary"] = "Salary cannot be negative.";
        }
        
        // Validate savings
        if (data.CurrentSavings < 0)
        {
            result.Errors["CurrentSavings"] = "Current savings cannot be negative.";
        }
        
        // Validate monthly contribution
        if (data.MonthlyContribution < 0)
        {
            result.Errors["MonthlyContribution"] = "Monthly contribution cannot be negative.";
        }
        
        // Validate risk tolerance
        var validRiskTolerances = new[] { "conservative", "moderate", "aggressive" };
        if (!validRiskTolerances.Contains(data.RiskTolerance?.ToLower()))
        {
            result.Errors["RiskTolerance"] = "Risk tolerance must be one of: conservative, moderate, aggressive.";
        }
        
        result.IsValid = result.Errors.Count == 0;
        return result;
    }
}
