using AlugaFacilApi.Data;
using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.Models;
using AlugaFacilApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaFacilApi.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly AppDbContext _context;

    public PropertyRepository(AppDbContext context) => _context = context;

    public async Task<(List<Property> Items, int Total)> GetAllAsync(PropertyFilterRequest filter)
    {
        var query = _context.Properties
            .Include(p => p.Photos)
            .Include(p => p.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search))
        {
            var term = filter.Search.ToLower();
            query = query.Where(p =>
                p.City.ToLower().Contains(term) ||
                p.Neighborhood.ToLower().Contains(term) ||
                p.Title.ToLower().Contains(term));
        }

        if (!string.IsNullOrEmpty(filter.City))
            query = query.Where(p => p.City.ToLower().Contains(filter.City.ToLower()));

        if (!string.IsNullOrEmpty(filter.State))
            query = query.Where(p => p.State.ToLower() == filter.State.ToLower());

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (filter.Bedrooms.HasValue)
            query = query.Where(p => p.Bedrooms == filter.Bedrooms.Value);

        if (filter.PetsAllowed.HasValue)
            query = query.Where(p => p.PetsAllowed == filter.PetsAllowed.Value);

        if (filter.IsFurnished.HasValue)
            query = query.Where(p => p.IsFurnished == filter.IsFurnished.Value);

        if (!string.IsNullOrEmpty(filter.Tag))
            query = query.Where(p => p.Tags.Contains(filter.Tag));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.Id)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<List<Property>> GetAllForMapAsync() =>
        await _context.Properties
            .Include(p => p.Photos)
            .Select(p => new Property
            {
                Id = p.Id,
                Title = p.Title,
                Price = p.Price,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Photos = p.Photos.Take(1).ToList()
            })
            .ToListAsync();

    public async Task<Property?> GetByIdAsync(int id) =>
        await _context.Properties
            .Include(p => p.Photos)
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<List<Property>> GetByUserIdAsync(int userId) =>
        await _context.Properties
            .Include(p => p.Photos)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.Id)
            .ToListAsync();

    public async Task<Property> CreateAsync(Property property, List<string> photoUrls)
    {
        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        foreach (var url in photoUrls)
            _context.Photos.Add(new Photo { PropertyId = property.Id, Url = url });

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(property.Id))!;
    }

    public async Task<Property> UpdateAsync(Property property, List<string>? photoUrls)
    {
        _context.Properties.Update(property);

        if (photoUrls != null)
        {
            var existing = _context.Photos.Where(p => p.PropertyId == property.Id);
            _context.Photos.RemoveRange(existing);
            foreach (var url in photoUrls)
                _context.Photos.Add(new Photo { PropertyId = property.Id, Url = url });
        }

        await _context.SaveChangesAsync();
        return (await GetByIdAsync(property.Id))!;
    }

    public async Task DeleteAsync(Property property)
    {
        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();
    }

    public async Task<List<string>> GetDistinctCitiesAsync() =>
        await _context.Properties
            .Where(p => p.City != "")
            .Select(p => p.City)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
}
