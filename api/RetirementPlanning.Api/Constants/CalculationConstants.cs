namespace RetirementPlanning.Api.Constants;

/// <summary>
/// Constants used in retirement planning calculations.
/// </summary>
public static class CalculationConstants
{
    /// <summary>
    /// The withdrawal rate used for sustainable retirement income (4% rule).
    /// </summary>
    public const decimal WithdrawalRate = 0.04m;
    
    /// <summary>
    /// Number of months per year.
    /// </summary>
    public const int MonthsPerYear = 12;
    
    /// <summary>
    /// Divisor for converting annual rates to percentages.
    /// </summary>
    public const int AnnualToMonthlyDivisor = 100;
    
    /// <summary>
    /// Success rate when final balance is positive.
    /// </summary>
    public const decimal SuccessRatePositive = 95m;
    
    /// <summary>
    /// Success rate when final balance is negative or zero.
    /// </summary>
    public const decimal SuccessRateNegative = 45m;
}

/// <summary>
/// Predefined scenario configurations.
/// </summary>
public static class ScenarioConfigs
{
    public static readonly ScenarioConfig Conservative = new()
    {
        Id = "conservative",
        Name = "Conservative",
        Label = "Conservative (5% return, 2.5% inflation)",
        ReturnRate = 5m,
        InflationRate = 2.5m
    };
    
    public static readonly ScenarioConfig Moderate = new()
    {
        Id = "moderate",
        Name = "Moderate",
        Label = "Moderate (7% return, 3% inflation)",
        ReturnRate = 7m,
        InflationRate = 3m
    };
    
    public static readonly ScenarioConfig Aggressive = new()
    {
        Id = "aggressive",
        Name = "Aggressive",
        Label = "Aggressive (9% return, 3% inflation)",
        ReturnRate = 9m,
        InflationRate = 3m
    };
    
    public static IEnumerable<ScenarioConfig> GetAllScenarios()
    {
        return new[] { Conservative, Moderate, Aggressive };
    }
}

/// <summary>
/// Configuration for a retirement scenario.
/// </summary>
public class ScenarioConfig
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Label { get; set; }
    public required decimal ReturnRate { get; set; }
    public required decimal InflationRate { get; set; }
}

/// <summary>
/// Age validation constraints.
/// </summary>
public static class AgeConstraints
{
    public const int MinCurrentAge = 18;
    public const int MaxCurrentAge = 100;
    public const int MaxRetirementAge = 100;
    public const int MaxLifeExpectancy = 120;
}
