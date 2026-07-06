namespace AlugaFacilApi.Models;

public class User
{
    public int Id { get; set; }
    public string Cpf { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool Verified { get; set; } = false;

    // Navigation
    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<Review> ReviewsWritten { get; set; } = new List<Review>();
    public ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
}
