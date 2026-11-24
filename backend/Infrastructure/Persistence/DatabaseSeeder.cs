namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public static class DatabaseSeeder
{
    private static readonly string[] ParticipantNames =
    [
        "Juan Dela Cruz", "Maria Santos", "Jose Reyes", "Ana Garcia", "Miguel Bautista",
        "Angela Flores", "Carlos Mendoza", "Patricia Ramos", "Rafael Aquino", "Camille Navarro",
        "Gabriel Castillo", "Sofia Villanueva", "Daniel Cruz", "Isabella Torres", "Nathaniel Lim",
        "Bianca Fernandez", "Marco Evangelista", "Chloe Ramirez", "Luis Santiago", "Andrea Mercado",
        "Paolo Gonzales", "Mikaela Herrera", "Enzo Valdez", "Beatriz Salazar", "Andres Domingo"
    ];

    private static readonly string[] CarModels =
    [
        "Toyota Corolla", "Honda Civic", "Mitsubishi Lancer", "Nissan Skyline", "Mazda MX-5",
        "Subaru WRX", "Toyota Supra", "Honda City", "Ford Mustang", "Volkswagen Golf"
    ];

    private static readonly string[] Addresses =
    [
        "Naga City, Camarines Sur", "Legazpi City, Albay", "Sorsogon City, Sorsogon",
        "Iriga City, Camarines Sur", "Daraga, Albay"
    ];

    public static async Task SeedAsync(AppDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (!dbContext.Database.GetMigrations().Any())
        {
            throw new InvalidOperationException(
                "No EF Core migrations found. From the backend folder run: " +
                "dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Api --output-dir Persistence/Migrations");
        }

        await dbContext.Database.MigrateAsync(cancellationToken);
        if (await dbContext.Registrations.AnyAsync(cancellationToken))
        {
            return;
        }

        var types = Enum.GetValues<RegistrationType>();
        var statuses = Enum.GetValues<RegistrationStatus>();
        var registrations = Enumerable.Range(0, ParticipantNames.Length)
            .Select(index =>
            {
                var type = types[index % types.Length];
                var fee = type.GetFee();
                var amountPaid = (index + index / 3) % 3 switch
                {
                    0 => 0m,
                    1 => fee / 2m,
                    _ => fee
                };

                return new Registration
                {
                    Id = Guid.NewGuid(),
                    RegistrationNumber = $"CS27-{index + 1:D4}",
                    RegistrationDate = DateTime.UtcNow.AddDays(-index),
                    ParticipantName = ParticipantNames[index],
                    ContactNumber = $"09{index + 1:000000000}",
                    Email = $"participant{index + 1}@example.com",
                    Address = Addresses[index % Addresses.Length],
                    CarMakeModel = CarModels[index % CarModels.Length],
                    PlateNumber = $"CSG-{index + 1:0000}",
                    RegistrationType = type,
                    Status = statuses[index % statuses.Length],
                    RegistrationFee = fee,
                    AmountPaid = amountPaid
                };
            })
            .ToArray();

        dbContext.Registrations.AddRange(registrations);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
