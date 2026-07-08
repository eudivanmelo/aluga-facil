namespace AlugaFacilApi.DTOs.Response;

public record AuthResponse(
    string Token,
    UserResponse User
);

public record UserResponse(
    int Id,
    string Name,
    string Email,
    string Phone,
    string Cpf,
    bool Verified
);

public record PropertySummaryResponse(
    int Id,
    string Title,
    decimal Price,
    string PaymentFrequency,
    string City,
    string State,
    string Neighborhood,
    int Bedrooms,
    int Bathrooms,
    int ParkingSpaces,
    bool PetsAllowed,
    bool IsFurnished,
    List<string> Tags,
    string? FirstPhotoUrl,
    double Latitude,
    double Longitude
);

public record PropertyDetailResponse(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string PaymentFrequency,
    string Street,
    string Number,
    string Neighborhood,
    string Complement,
    string City,
    string State,
    double Latitude,
    double Longitude,
    int Bedrooms,
    int Bathrooms,
    int ParkingSpaces,
    bool PetsAllowed,
    bool IsFurnished,
    List<string> Tags,
    List<string> PhotoUrls,
    UserResponse Owner,
    string WhatsAppLink
);

public record PropertyMapResponse(
    int Id,
    string Title,
    decimal Price,
    double Latitude,
    double Longitude,
    string? FirstPhotoUrl
);

public record ReviewResponse(
    int Id,
    string Comment,
    UserResponse Author,
    int LandlordId
);

public record PagedResponse<T>(
    List<T> Data,
    int Page,
    int PageSize,
    int Total,
    int TotalPages
);

public record StatsResponse(
    int ActiveProperties,
    int Cities,
    int Users
);
