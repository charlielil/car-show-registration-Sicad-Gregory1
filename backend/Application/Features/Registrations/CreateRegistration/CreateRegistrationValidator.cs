namespace Application.Features.Registrations.CreateRegistration;

using Domain.Enums;
using FluentValidation;

public sealed class CreateRegistrationValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(command => command.ParticipantName).NotEmpty().MaximumLength(150);

        RuleFor(command => command.ContactNumber)
            .NotEmpty()
            .Matches(@"^09\d{9}$")
            .WithMessage("Contact number must be a Philippine mobile number in the format 09XXXXXXXXX (11 digits).");

        RuleFor(command => command.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(command => command.Address).NotEmpty().MaximumLength(300);
        RuleFor(command => command.CarMakeModel).NotEmpty().MaximumLength(100);
        RuleFor(command => command.PlateNumber).NotEmpty().MaximumLength(15);

        RuleFor(command => command.RegistrationType)
            .Must(registrationType => Enum.IsDefined(registrationType))
            .WithMessage("Registration type must be Exhibitor, Competitor or VIP.");

        RuleFor(command => command.AmountPaid)
            .GreaterThanOrEqualTo(0m)
            .WithMessage("Amount paid must be 0 or more.");

        RuleFor(command => command.AmountPaid)
            .Must((command, amountPaid) =>
                !Enum.IsDefined(command.RegistrationType) || amountPaid <= command.RegistrationType.GetFee())
            .WithMessage(command =>
                $"Amount paid cannot be more than the registration fee ({command.RegistrationType.GetFee():N0}) for {command.RegistrationType}.");
    }
}
