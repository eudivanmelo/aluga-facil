namespace AlugaFacilApi.Models;

public class Photo
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string Url { get; set; } = string.Empty;

    // Navigation
    public Property Property { get; set; } = null!;
}
