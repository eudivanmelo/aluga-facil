using AlugaFacilApi.Models;

namespace AlugaFacilApi.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<List<Review>> GetByLandlordIdAsync(int landlordId);
    Task<Review?> GetByIdAsync(int id);
    Task<bool> ExistsAsync(int authorId, int landlordId);
    Task<Review> CreateAsync(Review review);
    Task DeleteAsync(Review review);
}
