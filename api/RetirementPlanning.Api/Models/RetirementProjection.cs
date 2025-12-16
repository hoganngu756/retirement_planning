namespace RetirementPlanning.Api.Models;

/// <summary>
/// Represents a single year's projection data in a retirement scenario.
/// </summary>
public class RetirementProjection
{
    public int Id { get; set; }
    
    /// <summary>
    /// The year index of the projection (0 = current year).
    /// </summary>
    public int Year { get; set; }
    
    /// <summary>
    /// The projected age for this year.
    /// </summary>
    public int Age { get; set; }
    
    /// <summary>
    /// Projected account balance in dollars.
    /// </summary>
    public decimal Balance { get; set; }
    
    /// <summary>
    /// Annual contribution amount in dollars.
    /// </summary>
    public decimal Contribution { get; set; }
    
    /// <summary>
    /// Annual investment return in dollars.
    /// </summary>
    public decimal InvestmentReturn { get; set; }
    
    /// <summary>
    /// Annual withdrawal amount in dollars (after retirement).
    /// </summary>
    public decimal Withdrawal { get; set; }
    
    /// <summary>
    /// The scenario this projection belongs to.
    /// </summary>
    public int RetirementScenarioId { get; set; }
    public RetirementScenario? RetirementScenario { get; set; }
}
