namespace Api.Features.Registrations;

using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Application.Features.Registrations.GetRegistrations;
using Domain.Common;

public static class RegistrationEndpoints
{
    public static void MapRegistrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations").WithTags("Registrations");

        group.MapPost("/", Create)
            .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
            .WithName("CreateRegistration")
            .WithSummary("Create a car show registration")
            .Produces<RegistrationDto>(StatusCodes.Status201Created)
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status409Conflict);

        group.MapGet("/", GetAll)
            .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
            .WithName("GetRegistrations")
            .WithSummary("Get registrations (paged) with optional type, status and participantName filters")
            .Produces<PagedRegistrationsResponse>()
            .ProducesValidationProblem();

        // Literal route: matches before "/{id:guid}", so "summary" is never treated as an id.
        group.MapGet("/summary", GetSummary)
            .WithName("GetRegistrationSummary")
            .WithSummary("KPI totals for the dashboard (cancelled excluded from money totals)")
            .Produces<RegistrationSummaryResponse>();

        group.MapGet("/{id:guid}", GetById)
            .WithName("GetRegistrationById")
            .WithSummary("Get a registration by ID")
            .Produces<RegistrationDto>()
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> Create(
        CreateRegistrationCommand command,
        ICommandHandler<CreateRegistrationCommand, Result<RegistrationDto>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(command, cancellationToken);
        return result.IsSuccess
            ? Results.Created($"/api/registrations/{result.Value!.Id}", result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> GetAll(
        [AsParameters] GetRegistrationsQuery query,
        IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(query, cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
    }

    private static async Task<IResult> GetById(
        Guid id,
        IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationDto>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(new GetRegistrationByIdQuery(id), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
    }

    private static async Task<IResult> GetSummary(
        IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(new GetRegistrationSummaryQuery(), cancellationToken);
        return result.IsSuccess ? Results.Ok(result.Value) : result.ToProblemDetails();
    }
}
