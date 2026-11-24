namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Messaging;
using Domain.Common;

public sealed record GetRegistrationSummaryQuery : IQuery<Result<RegistrationSummaryResponse>>;

/// <summary>Matches the shared JSON contract (section F of the project guide).</summary>
public sealed record RegistrationSummaryResponse(
    int TotalRegistrations,
    int Confirmed,
    int CheckedIn,
    int Pending,
    int Cancelled,
    decimal TotalFees,
    decimal TotalPayments,
    decimal UncollectedPayments);
