using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Models;
using AlugaFacilApi.Repositories.Interfaces;
using AlugaFacilApi.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace AlugaFacilApi.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new InvalidOperationException("E-mail já está em uso.");

        if (await _userRepository.ExistsByCpfAsync(request.Cpf))
            throw new InvalidOperationException("CPF já está cadastrado.");

        var user = new User
        {
            Cpf = request.Cpf,
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Phone = request.Phone
        };

        await _userRepository.CreateAsync(user);

        var token = GenerateToken(user);
        return new AuthResponse(token, MapToResponse(user));
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByCpfAsync(request.Cpf)
            ?? throw new UnauthorizedAccessException("Credenciais inválidas.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            throw new UnauthorizedAccessException("Credenciais inválidas.");

        var token = GenerateToken(user);
        return new AuthResponse(token, MapToResponse(user));
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserResponse MapToResponse(User u) =>
        new(u.Id, u.Name, u.Email, u.Phone, u.Cpf, u.Verified);
}
