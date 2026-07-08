using AlugaFacilApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AlugaFacilApi.Controllers;

[ApiController]
[Route("api/stats")]
[Produces("application/json")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _statsService;

    public StatsController(IStatsService statsService) => _statsService = statsService;

    /// <summary>Números gerais da plataforma (imóveis ativos, cidades atendidas, usuários) — usado no Hero da home.</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStats()
    {
        var result = await _statsService.GetStatsAsync();
        return Ok(result);
    }
}
