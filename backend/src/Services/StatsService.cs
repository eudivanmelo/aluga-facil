using AlugaFacilApi.Data;
using AlugaFacilApi.DTOs.Response;
using AlugaFacilApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaFacilApi.Services;

public class StatsService : IStatsService
{
    private readonly AppDbContext _context;

    public StatsService(AppDbContext context) => _context = context;

    public async Task<StatsResponse> GetStatsAsync()
    {
        var activeProperties = await _context.Properties.CountAsync();
        var cities = await _context.Properties.Select(p => p.City).Distinct().CountAsync();
        var users = await _context.Users.CountAsync();

        return new StatsResponse(activeProperties, cities, users);
    }
}
