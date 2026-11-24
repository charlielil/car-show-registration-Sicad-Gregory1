namespace Application.Features.Registrations.GetRegistrations;

using Domain.Enums;
using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(query => query.Page).GreaterThanOrEqualTo(1).WithMessage("Page must be 1 or more.");
        RuleFor(query => query.PageSize).InclusiveBetween(1, 50).WithMessage("Page size must be between 1 and 50.");
        RuleFor(query => query.ParticipantName).MaximumLength(150);
        RuleFor(query => query.Type)
            .Must(IsOptionalRegistrationType)
            .WithMessage("Type must be Exhibitor, Competitor or VIP.");
        RuleFor(query => query.Status)
            .Must(IsOptionalRegistrationStatus)
            .WithMessage("Status must be Pending, Confirmed, CheckedIn or Cancelled.");
    }

    private static bool IsOptionalRegistrationType(string? value) =>
        string.IsNullOrWhiteSpace(value) ||
        (Enum.TryParse<RegistrationType>(value, true, out var registrationType) &&
         Enum.IsDefined(registrationType));

    private static bool IsOptionalRegistrationStatus(string? value) =>
        string.IsNullOrWhiteSpace(value) ||
        (Enum.TryParse<RegistrationStatus>(value, true, out var status) && Enum.IsDefined(status));
}
