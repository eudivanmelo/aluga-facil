using AlugaFacilApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AlugaFacilApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Photo> Photos => Set<Photo>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).HasColumnName("id");
            e.Property(u => u.Cpf).HasColumnName("cpf").HasMaxLength(14).IsRequired();
            e.Property(u => u.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
            e.Property(u => u.Email).HasColumnName("email").HasMaxLength(200).IsRequired();
            e.Property(u => u.Password).HasColumnName("password").IsRequired();
            e.Property(u => u.Phone).HasColumnName("phone").HasMaxLength(20);
            e.Property(u => u.Verified).HasColumnName("verified").HasDefaultValue(false);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Cpf).IsUnique();
        });

        // Property
        modelBuilder.Entity<Property>(e =>
        {
            e.ToTable("properties");
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).HasColumnName("id");
            e.Property(p => p.UserId).HasColumnName("user_id");
            e.Property(p => p.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
            e.Property(p => p.Description).HasColumnName("description");
            e.Property(p => p.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            e.Property(p => p.PaymentFrequency).HasColumnName("payment_frequency").HasMaxLength(50);
            e.Property(p => p.Street).HasColumnName("street").HasMaxLength(200);
            e.Property(p => p.Number).HasColumnName("number").HasMaxLength(20);
            e.Property(p => p.Neighborhood).HasColumnName("neighborhood").HasMaxLength(200);
            e.Property(p => p.Complement).HasColumnName("complement").HasMaxLength(100);
            e.Property(p => p.City).HasColumnName("city").HasMaxLength(200);
            e.Property(p => p.State).HasColumnName("state").HasMaxLength(2);
            e.Property(p => p.Latitude).HasColumnName("latitude");
            e.Property(p => p.Longitude).HasColumnName("longitude");
            e.Property(p => p.Bedrooms).HasColumnName("bedrooms");
            e.Property(p => p.Bathrooms).HasColumnName("bathrooms");
            e.Property(p => p.ParkingSpaces).HasColumnName("parking_spaces");
            e.Property(p => p.PetsAllowed).HasColumnName("pets_allowed").HasDefaultValue(false);
            e.Property(p => p.IsFurnished).HasColumnName("is_furnished").HasDefaultValue(false);
            e.Property(p => p.Tags).HasColumnName("tags").HasColumnType("text[]");

            e.HasOne(p => p.User)
             .WithMany(u => u.Properties)
             .HasForeignKey(p => p.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Photo
        modelBuilder.Entity<Photo>(e =>
        {
            e.ToTable("photos");
            e.HasKey(p => p.Id);
            e.Property(p => p.Id).HasColumnName("id");
            e.Property(p => p.PropertyId).HasColumnName("property_id");
            e.Property(p => p.Url).HasColumnName("url").IsRequired();

            e.HasOne(p => p.Property)
             .WithMany(pr => pr.Photos)
             .HasForeignKey(p => p.PropertyId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Review
        modelBuilder.Entity<Review>(e =>
        {
            e.ToTable("reviews");
            e.HasKey(r => r.Id);
            e.Property(r => r.Id).HasColumnName("id");
            e.Property(r => r.AuthorId).HasColumnName("author_id");
            e.Property(r => r.LandlordId).HasColumnName("landlord_id");
            e.Property(r => r.Comment).HasColumnName("comment").IsRequired();

            e.HasOne(r => r.Author)
             .WithMany(u => u.ReviewsWritten)
             .HasForeignKey(r => r.AuthorId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.Landlord)
             .WithMany(u => u.ReviewsReceived)
             .HasForeignKey(r => r.LandlordId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
