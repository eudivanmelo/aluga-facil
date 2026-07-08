namespace AlugaFacilApi.DTOs.Request;

public record CreatePropertyRequest(
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
    List<string> PhotoUrls
);

public record UpdatePropertyRequest(
    string? Title,
    string? Description,
    decimal? Price,
    string? PaymentFrequency,
    string? Street,
    string? Number,
    string? Neighborhood,
    string? Complement,
    string? City,
    string? State,
    double? Latitude,
    double? Longitude,
    int? Bedrooms,
    int? Bathrooms,
    int? ParkingSpaces,
    bool? PetsAllowed,
    bool? IsFurnished,
    List<string>? Tags,
    List<string>? PhotoUrls
);

public record PropertyFilterRequest
{
    /// <summary>Busca livre — combina cidade, bairro e título (usada pela busca do Hero).</summary>
    public string? Search { get; init; }
    public string? City { get; init; }
    public string? State { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public int? Bedrooms { get; init; }
    public bool? PetsAllowed { get; init; }
    public bool? IsFurnished { get; init; }
    public string? Tag { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
