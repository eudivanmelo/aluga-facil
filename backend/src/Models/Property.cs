namespace AlugaFacilApi.Models;

public class Property
{
    public int Id { get; set; }
    public int UserId { get; set; }

    // Main data
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;

    // Address
    public string Street { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string Complement { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;

    // Geolocation
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // Structure
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int ParkingSpaces { get; set; }

    // Rules / Status
    public bool PetsAllowed { get; set; }
    public bool IsFurnished { get; set; }

    // Categorization
    public List<string> Tags { get; set; } = new List<string>();

    // Navigation
    public User User { get; set; } = null!;
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
}
