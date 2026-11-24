namespace Application.Features.Registrations.GetRegistrationById;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationByIdHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationDto>>
{
    public async Task<Result<RegistrationDto>> HandleAsync(
        GetRegistrationByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var registration = await dbContext.Registrations
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == query.Id, cancellationToken);

        return registration is null
            ? Result<RegistrationDto>.Failure(
                Error.NotFound("Registration.NotFound", "Registration was not found."))
            : Result<RegistrationDto>.Success(RegistrationDto.FromEntity(registration));
    }
}
