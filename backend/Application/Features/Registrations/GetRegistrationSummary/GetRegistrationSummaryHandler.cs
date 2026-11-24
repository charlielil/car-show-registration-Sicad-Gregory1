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
        // Only the columns needed are loaded. Decimal sums are done in memory because
        // SQLite cannot SUM decimal columns on the database side.
        var rows = await dbContext.Registrations
            .AsNoTracking()
            .Select(registration => new
            {
                registration.Status,
                registration.RegistrationFee,
                registration.AmountPaid
            })
            .ToListAsync(cancellationToken);

        // Cancelled registrations are excluded from the money totals.
        var active = rows.Where(row => row.Status != RegistrationStatus.Cancelled).ToList();
        var totalFees = active.Sum(row => row.RegistrationFee);
        var totalPayments = active.Sum(row => row.AmountPaid);

        var response = new RegistrationSummaryResponse(
            TotalRegistrations: rows.Count,
            Confirmed: rows.Count(row => row.Status == RegistrationStatus.Confirmed),
            CheckedIn: rows.Count(row => row.Status == RegistrationStatus.CheckedIn),
            Pending: rows.Count(row => row.Status == RegistrationStatus.Pending),
            Cancelled: rows.Count(row => row.Status == RegistrationStatus.Cancelled),
            TotalFees: totalFees,
            TotalPayments: totalPayments,
            UncollectedPayments: totalFees - totalPayments);

        return Result<RegistrationSummaryResponse>.Success(response);
    }
}
