namespace RetirementPlanning.Api.Models;

/// <summary>
/// Represents the financial profile and retirement parameters for a user.
/// </summary>
public class UserFinancialData
{
    public int Id { get; set; }
    
    /// <summary>
    /// User's current age in years.
    /// </summary>
    public int CurrentAge { get; set; }
    
    /// <summary>
    /// Target retirement age in years.
    /// </summary>
    public int RetirementAge { get; set; }
    
    /// <summary>
    /// Current annual salary in dollars.
    /// </summary>
    public decimal CurrentSalary { get; set; }
    
    /// <summary>
    /// Total current savings/investments in dollars.
    /// </summary>
    public decimal CurrentSavings { get; set; }
    
    /// <summary>
    /// Monthly contribution amount in dollars.
    /// </summary>
    public decimal MonthlyContribution { get; set; }
    
    /// <summary>
    /// Expected life expectancy in years.
    /// </summary>
    public int LifeExpectancy { get; set; }
    
    /// <summary>
    /// Investment risk tolerance level (conservative, moderate, aggressive).
    /// </summary>
    public string RiskTolerance { get; set; } = "moderate";
    
    /// <summary>
    /// Timestamp when this profile was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Timestamp when this profile was last updated.
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
