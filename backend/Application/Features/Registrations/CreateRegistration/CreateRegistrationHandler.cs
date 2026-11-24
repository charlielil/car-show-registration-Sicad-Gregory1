namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationHandler(IAppDbContext dbContext)
    : ICommandHandler<CreateRegistrationCommand, Result<RegistrationDto>>
{
    public async Task<Result<RegistrationDto>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var plateNumber = command.PlateNumber.Trim().ToUpperInvariant();
        if (await dbContext.Registrations.AnyAsync(
                registration => registration.PlateNumber == plateNumber,
                cancellationToken))
        {
            return Result<RegistrationDto>.Failure(
                Error.Conflict("Registration.Conflict", "A registration already exists for this plate number."));
        }

        var latestNumber = await dbContext.Registrations
            .AsNoTracking()
            .Where(registration => registration.RegistrationNumber.StartsWith("CS27-"))
            .OrderByDescending(registration => registration.RegistrationNumber)
            .Select(registration => registration.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var nextSequence = latestNumber is not null &&
                           int.TryParse(latestNumber.AsSpan(5), out var sequence)
            ? sequence + 1
            : 1;

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = $"CS27-{nextSequence:D4}",
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = plateNumber,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = command.RegistrationType.GetFee(),
            AmountPaid = command.AmountPaid
        };

        dbContext.Registrations.Add(registration);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<RegistrationDto>.Success(RegistrationDto.FromEntity(registration));
    }
}
