using AlugaFacilApi.Models;

namespace AlugaFacilApi.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByCpfAsync(string cpf);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByCpfAsync(string cpf);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task DeleteAsync(User user);
}
