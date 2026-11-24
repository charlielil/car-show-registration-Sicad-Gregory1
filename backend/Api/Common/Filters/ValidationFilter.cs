namespace Api.Common.Filters;

using FluentValidation;

/// <summary>
/// Endpoint filter that runs the FluentValidation validator for <typeparamref name="T"/>
/// before the endpoint handler. Invalid input short-circuits with a 400 ProblemDetails
/// (validation problem) response and the handler is never called.
/// </summary>
public sealed class ValidationFilter<T> : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var argument = context.Arguments.OfType<T>().FirstOrDefault();
        if (argument is null)
        {
            return Results.Problem(
                title: "Registration.Validation",
                detail: "The request body or query string is missing or malformed.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();
        if (validator is null)
        {
            return await next(context);
        }

        var validation = await validator.ValidateAsync(argument, context.HttpContext.RequestAborted);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        return await next(context);
    }
}
