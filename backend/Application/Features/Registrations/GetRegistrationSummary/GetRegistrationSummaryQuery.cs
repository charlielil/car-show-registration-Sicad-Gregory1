namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Messaging;
using Domain.Common;

public sealed record GetRegistrationSummaryQuery : IQuery<Result<RegistrationSummaryResponse>>;

public sealed record RegistrationSummaryResponse(
    int TotalRegistrations,
    int PendingRegistrations,
    int ConfirmedRegistrations,
    int CheckedInRegistrations,
    int CancelledRegistrations,
    int ExhibitorRegistrations,
    int CompetitorRegistrations,
    int VipRegistrations,
    int UnpaidRegistrations,
    int PartialRegistrations,
    int PaidRegistrations,
    decimal TotalRegistrationFees,
    decimal TotalAmountPaid);
