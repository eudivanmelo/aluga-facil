using AlugaFacilApi.Data;
using AlugaFacilApi.Models;
using AlugaFacilApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaFacilApi.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context) => _context = context;

    public async Task<List<Review>> GetByLandlordIdAsync(int landlordId) =>
        await _context.Reviews
            .Include(r => r.Author)
            .Where(r => r.LandlordId == landlordId)
            .OrderByDescending(r => r.Id)
            .ToListAsync();

    public async Task<Review?> GetByIdAsync(int id) =>
        await _context.Reviews
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<bool> ExistsAsync(int authorId, int landlordId) =>
        await _context.Reviews.AnyAsync(r => r.AuthorId == authorId && r.LandlordId == landlordId);

    public async Task<Review> CreateAsync(Review review)
    {
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        return (await GetByIdAsync(review.Id))!;
    }

    public async Task DeleteAsync(Review review)
    {
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }
}
