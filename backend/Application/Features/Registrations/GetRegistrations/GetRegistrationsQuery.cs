namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;

public sealed record GetRegistrationsQuery(
    string? ParticipantName = null,
    string? Type = null,
    string? Status = null,
    int Page = 1,
    int PageSize = 10) : IQuery<Result<PagedRegistrationsResponse>>;

public sealed record PagedRegistrationsResponse(
    IReadOnlyList<RegistrationDto> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
