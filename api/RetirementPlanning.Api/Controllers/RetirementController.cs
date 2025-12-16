using Microsoft.AspNetCore.Mvc;
using RetirementPlanning.Api.Models;
using RetirementPlanning.Api.Services;

namespace RetirementPlanning.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RetirementController : ControllerBase
{
    private readonly ICalculationService _calculationService;
    private readonly IValidationService _validationService;
    
    public RetirementController(
        ICalculationService calculationService,
        IValidationService validationService)
    {
        _calculationService = calculationService;
        _validationService = validationService;
    }
    
    /// <summary>
    /// Generates retirement scenarios based on user financial data.
    /// </summary>
    /// <param name="userData">The user's financial profile and retirement parameters.</param>
    /// <returns>An array of three retirement scenarios (conservative, moderate, aggressive) with projections.</returns>
    [HttpPost("scenarios")]
    public IActionResult GenerateScenarios([FromBody] UserFinancialData userData)
    {
        if (userData == null)
        {
            return BadRequest(new { error = "User financial data is required." });
        }
        
        // Validate input
        var validationResult = _validationService.Validate(userData);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors });
        }
        
        try
        {
            // Set a temporary ID for calculation purposes (will be replaced with DB ID later)
            userData.Id = 0;
            
            var scenarios = _calculationService.GenerateScenarios(userData);
            
            return Ok(new
            {
                success = true,
                data = scenarios
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while generating scenarios.", details = ex.Message });
        }
    }
    
    /// <summary>
    /// Calculates a single projection for testing/validation purposes.
    /// </summary>
    /// <param name="request">Contains user financial data and scenario parameters.</param>
    /// <returns>A list of year-by-year projections.</returns>
    [HttpPost("projections")]
    public IActionResult GenerateProjections([FromBody] ProjectionRequest request)
    {
        if (request?.UserFinancialData == null)
        {
            return BadRequest(new { error = "User financial data is required." });
        }
        
        // Validate input
        var validationResult = _validationService.Validate(request.UserFinancialData);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors });
        }
        
        try
        {
            var projections = _calculationService.GenerateProjections(
                request.UserFinancialData,
                request.ReturnRate,
                request.InflationRate);
            
            return Ok(new
            {
                success = true,
                data = projections
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while generating projections.", details = ex.Message });
        }
    }
    
    /// <summary>
    /// Health check endpoint.
    /// </summary>
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}

/// <summary>
/// Request model for generating projections with specific market assumptions.
/// </summary>
public class ProjectionRequest
{
    public UserFinancialData? UserFinancialData { get; set; }
    public decimal ReturnRate { get; set; }
    public decimal InflationRate { get; set; }
}
