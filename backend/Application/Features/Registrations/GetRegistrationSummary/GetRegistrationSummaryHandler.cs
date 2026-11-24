namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>
{
    public async Task<Result<RegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = await dbContext.Registrations
            .AsNoTracking()
            .Select(registration => new
            {
                registration.Status,
                registration.RegistrationType,
                registration.RegistrationFee,
                registration.AmountPaid
            })
            .ToListAsync(cancellationToken);

        var response = new RegistrationSummaryResponse(
            registrations.Count,
            registrations.Count(registration => registration.Status == RegistrationStatus.Pending),
            registrations.Count(registration => registration.Status == RegistrationStatus.Confirmed),
            registrations.Count(registration => registration.Status == RegistrationStatus.CheckedIn),
            registrations.Count(registration => registration.Status == RegistrationStatus.Cancelled),
            registrations.Count(registration => registration.RegistrationType == RegistrationType.Exhibitor),
            registrations.Count(registration => registration.RegistrationType == RegistrationType.Competitor),
            registrations.Count(registration => registration.RegistrationType == RegistrationType.VIP),
            registrations.Count(registration => registration.AmountPaid == 0m),
            registrations.Count(registration =>
                registration.AmountPaid > 0m && registration.AmountPaid < registration.RegistrationFee),
            registrations.Count(registration => registration.AmountPaid == registration.RegistrationFee),
            registrations.Sum(registration => registration.RegistrationFee),
            registrations.Sum(registration => registration.AmountPaid));

        return Result<RegistrationSummaryResponse>.Success(response);
    }
}
