using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.Middlewares;
using AlugaFacilApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlugaFacilApi.Controllers;

[ApiController]
[Route("api/reviews")]
[Produces("application/json")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    /// <summary>Retorna todas as avaliações de um locador específico.</summary>
    [HttpGet("landlord/{landlordId:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByLandlord(int landlordId)
    {
        var result = await _reviewService.GetByLandlordAsync(landlordId);
        return Ok(result);
    }

    /// <summary>Cria uma avaliação sobre um locador. RF06 - Avaliar Proprietário.</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var authorId = User.GetUserId();
        var result = await _reviewService.CreateAsync(authorId, request);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>Deleta uma avaliação feita pelo usuário autenticado.</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var authorId = User.GetUserId();
        await _reviewService.DeleteAsync(authorId, id);
        return NoContent();
    }
}
