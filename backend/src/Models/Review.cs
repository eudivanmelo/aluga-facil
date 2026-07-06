namespace AlugaFacilApi.Models;

public class Review
{
    public int Id { get; set; }
    public int AuthorId { get; set; }
    public int LandlordId { get; set; }
    public string Comment { get; set; } = string.Empty;

    // Navigation
    public User Author { get; set; } = null!;
    public User Landlord { get; set; } = null!;
}
