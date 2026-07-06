using System.Security.Claims;

namespace AlugaFacilApi.Middlewares;

public static class ClaimExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Token inválido.");
        return int.Parse(claim.Value);
    }
}
