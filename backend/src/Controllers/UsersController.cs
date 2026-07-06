using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.Middlewares;
using AlugaFacilApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlugaFacilApi.Controllers;

[ApiController]
[Route("api/users")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    /// <summary>Retorna o perfil do usuário autenticado.</summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.GetUserId();
        var result = await _userService.GetProfileAsync(userId);
        return Ok(result);
    }

    /// <summary>Atualiza os dados pessoais do usuário autenticado.</summary>
    [Authorize]
    [HttpPut("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        var userId = User.GetUserId();
        var result = await _userService.UpdateProfileAsync(userId, request);
        return Ok(result);
    }
}
