using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.Middlewares;
using AlugaFacilApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlugaFacilApi.Controllers;

[ApiController]
[Route("api/properties")]
[Produces("application/json")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;

    public PropertiesController(IPropertyService propertyService) => _propertyService = propertyService;

    /// <summary>
    /// Retorna o catálogo de imóveis com filtros e paginação.
    /// RF01 - Explorar Catálogo | RF02 - Filtrar Imóveis
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCatalog([FromQuery] PropertyFilterRequest filter)
    {
        var result = await _propertyService.GetCatalogAsync(filter);
        return Ok(result);
    }

    /// <summary>
    /// Retorna pontos de geolocalização de todos os imóveis para exibição no mapa.
    /// RF03 - Visualização Geográfica
    /// </summary>
    [HttpGet("map")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMapProperties()
    {
        var result = await _propertyService.GetMapPropertiesAsync();
        return Ok(result);
    }

    /// <summary>Retorna as cidades distintas com imóveis cadastrados, para popular filtros.</summary>
    [HttpGet("cities")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCities()
    {
        var result = await _propertyService.GetDistinctCitiesAsync();
        return Ok(result);
    }

    /// <summary>Retorna os detalhes completos de um imóvel, incluindo link de WhatsApp do proprietário.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _propertyService.GetByIdAsync(id);
        return Ok(result);
    }

    /// <summary>Retorna os anúncios do usuário autenticado.</summary>
    [Authorize]
    [HttpGet("mine")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyProperties()
    {
        var userId = User.GetUserId();
        var result = await _propertyService.GetMyPropertiesAsync(userId);
        return Ok(result);
    }

    /// <summary>Cria um novo anúncio de imóvel para o usuário autenticado.</summary>
    [Authorize]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
    {
        var userId = User.GetUserId();
        var result = await _propertyService.CreateAsync(userId, request);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>Atualiza um anúncio existente do usuário autenticado.</summary>
    [Authorize]
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePropertyRequest request)
    {
        var userId = User.GetUserId();
        var result = await _propertyService.UpdateAsync(userId, id, request);
        return Ok(result);
    }

    /// <summary>Deleta um anúncio do usuário autenticado.</summary>
    [Authorize]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();
        await _propertyService.DeleteAsync(userId, id);
        return NoContent();
    }
}
