namespace AlugaFacilApi.DTOs.Request;

public record RegisterRequest(
    string Cpf,
    string Name,
    string Email,
    string Password,
    string Phone
);

public record LoginRequest(
    string Cpf,
    string Password
);

public record UpdateUserRequest(
    string? Name,
    string? Phone
);
