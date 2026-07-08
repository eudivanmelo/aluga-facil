using AlugaFacilApi.DTOs.Request;
using AlugaFacilApi.DTOs.Response;

namespace AlugaFacilApi.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}

public interface IUserService
{
    Task<UserResponse> GetProfileAsync(int userId);
    Task<UserResponse> UpdateProfileAsync(int userId, UpdateUserRequest request);
}

public interface IPropertyService
{
    Task<PagedResponse<PropertySummaryResponse>> GetCatalogAsync(PropertyFilterRequest filter);
    Task<List<PropertyMapResponse>> GetMapPropertiesAsync();
    Task<PropertyDetailResponse> GetByIdAsync(int id);
    Task<List<PropertySummaryResponse>> GetMyPropertiesAsync(int userId);
    Task<PropertyDetailResponse> CreateAsync(int userId, CreatePropertyRequest request);
    Task<PropertyDetailResponse> UpdateAsync(int userId, int propertyId, UpdatePropertyRequest request);
    Task DeleteAsync(int userId, int propertyId);
    Task<List<string>> GetDistinctCitiesAsync();
}

public interface IStatsService
{
    Task<StatsResponse> GetStatsAsync();
}

public interface IReviewService
{
    Task<List<ReviewResponse>> GetByLandlordAsync(int landlordId);
    Task<ReviewResponse> CreateAsync(int authorId, CreateReviewRequest request);
    Task DeleteAsync(int authorId, int reviewId);
}

public interface IStorageService
{
    Task<string> UploadAsync(IFormFile file);
    Task DeleteAsync(string fileUrl);
}
