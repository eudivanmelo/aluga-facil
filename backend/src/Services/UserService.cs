using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Repositories.Interfaces;
using AlugaFacilApi.Services.Interfaces;

namespace AlugaFacilApi.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository) => _userRepository = userRepository;

    public async Task<UserResponse> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Usuário não encontrado.");

        return new UserResponse(user.Id, user.Name, user.Email, user.Phone, user.Cpf, user.Verified);
    }

    public async Task<UserResponse> UpdateProfileAsync(int userId, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Usuário não encontrado.");

        if (request.Name != null) user.Name = request.Name;
        if (request.Phone != null) user.Phone = request.Phone;

        await _userRepository.UpdateAsync(user);
        return new UserResponse(user.Id, user.Name, user.Email, user.Phone, user.Cpf, user.Verified);
    }
}
