namespace RetirementPlanning.Api.Models;

/// <summary>
/// Represents a retirement scenario with specific market assumptions.
/// </summary>
public class RetirementScenario
{
    public int Id { get; set; }
    
    /// <summary>
    /// Unique identifier for the scenario (e.g., 'conservative', 'moderate', 'aggressive').
    /// </summary>
    public string ScenarioId { get; set; } = string.Empty;
    
    /// <summary>
    /// Display name for the scenario.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Descriptive label explaining the scenario assumptions.
    /// </summary>
    public string Label { get; set; } = string.Empty;
    
    /// <summary>
    /// Annual return rate percentage (e.g., 7.0 for 7%).
    /// </summary>
    public decimal ReturnRate { get; set; }
    
    /// <summary>
    /// Annual inflation rate percentage (e.g., 3.0 for 3%).
    /// </summary>
    public decimal InflationRate { get; set; }
    
    /// <summary>
    /// Final projected balance at end of life expectancy.
    /// </summary>
    public decimal FinalBalance { get; set; }
    
    /// <summary>
    /// Success rate probability as percentage (e.g., 95.0 for 95%).
    /// </summary>
    public decimal SuccessRate { get; set; }
    
    /// <summary>
    /// The user's financial data this scenario is based on.
    /// </summary>
    public int UserFinancialDataId { get; set; }
    public UserFinancialData? UserFinancialData { get; set; }
    
    /// <summary>
    /// Collection of year-by-year projections for this scenario.
    /// </summary>
    public ICollection<RetirementProjection> Projections { get; set; } = new List<RetirementProjection>();
}
