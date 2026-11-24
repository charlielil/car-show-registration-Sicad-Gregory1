namespace Infrastructure.Persistence;

using Application.Abstractions.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Registration> Registrations => Set<Registration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(registration => registration.Id);
            entity.HasIndex(registration => registration.RegistrationNumber).IsUnique();
            entity.HasIndex(registration => registration.PlateNumber).IsUnique();
            entity.Property(registration => registration.RegistrationNumber).IsRequired().HasMaxLength(20);
            entity.Property(registration => registration.RegistrationDate)
                .HasConversion(new DateTimeToBinaryConverter());
            entity.Property(registration => registration.ParticipantName).IsRequired().HasMaxLength(150);
            entity.Property(registration => registration.ContactNumber).IsRequired().HasMaxLength(11);
            entity.Property(registration => registration.Email).IsRequired().HasMaxLength(200);
            entity.Property(registration => registration.Address).IsRequired().HasMaxLength(300);
            entity.Property(registration => registration.CarMakeModel).IsRequired().HasMaxLength(100);
            entity.Property(registration => registration.PlateNumber)
                .IsRequired()
                .HasMaxLength(15)
                .UseCollation("NOCASE");
            entity.Property(registration => registration.RegistrationType).HasConversion<string>();
            entity.Property(registration => registration.Status).HasConversion<string>();
            entity.Property(registration => registration.RegistrationFee).HasPrecision(10, 2);
            entity.Property(registration => registration.AmountPaid).HasPrecision(10, 2);
            entity.Ignore(registration => registration.PaymentStatus);
        });
    }
}
