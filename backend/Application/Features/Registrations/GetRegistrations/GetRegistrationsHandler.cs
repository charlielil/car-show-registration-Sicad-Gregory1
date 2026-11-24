namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>>
{
    public async Task<Result<PagedRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = dbContext.Registrations.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var participantName = query.ParticipantName.Trim()
                .Replace("\\", "\\\\", StringComparison.Ordinal)
                .Replace("%", "\\%", StringComparison.Ordinal)
                .Replace("_", "\\_", StringComparison.Ordinal);
            registrations = registrations.Where(registration =>
                EF.Functions.Like(registration.ParticipantName, $"%{participantName}%", "\\"));
        }

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            if (!Enum.TryParse<RegistrationType>(query.Type, true, out var registrationType) ||
                !Enum.IsDefined(registrationType))
            {
                return Result<PagedRegistrationsResponse>.Failure(
                    Error.Validation("Registration.Validation", "Type must be a valid registration type."));
            }

            registrations = registrations.Where(registration => registration.RegistrationType == registrationType);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            if (!Enum.TryParse<RegistrationStatus>(query.Status, true, out var status) ||
                !Enum.IsDefined(status))
            {
                return Result<PagedRegistrationsResponse>.Failure(
                    Error.Validation("Registration.Validation", "Status must be a valid registration status."));
            }

            registrations = registrations.Where(registration => registration.Status == status);
        }

        var totalCount = await registrations.CountAsync(cancellationToken);
        var items = await registrations
            .OrderByDescending(registration => registration.RegistrationDate)
            .ThenByDescending(registration => registration.RegistrationNumber)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var response = new PagedRegistrationsResponse(
            items.Select(RegistrationDto.FromEntity).ToArray(),
            query.Page,
            query.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)query.PageSize));

        return Result<PagedRegistrationsResponse>.Success(response);
    }
}
