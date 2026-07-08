using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.Models;

namespace AlugaFacilApi.Repositories.Interfaces;

public interface IPropertyRepository
{
    Task<(List<Property> Items, int Total)> GetAllAsync(PropertyFilterRequest filter);
    Task<List<Property>> GetAllForMapAsync();
    Task<Property?> GetByIdAsync(int id);
    Task<List<Property>> GetByUserIdAsync(int userId);
    Task<Property> CreateAsync(Property property, List<string> photoUrls);
    Task<Property> UpdateAsync(Property property, List<string>? photoUrls);
    Task DeleteAsync(Property property);
    Task<List<string>> GetDistinctCitiesAsync();
}
