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
            .Matches("^09\\d{9}$")
            .WithMessage("Contact number must be an 11-digit Philippine mobile number starting with 09.");
        RuleFor(command => command.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(command => command.Address).NotEmpty().MaximumLength(300);
        RuleFor(command => command.CarMakeModel).NotEmpty().MaximumLength(100);
        RuleFor(command => command.PlateNumber).NotEmpty().MaximumLength(15);
        RuleFor(command => command.RegistrationType)
            .Must(registrationType => Enum.IsDefined(registrationType))
            .WithMessage("Registration type is invalid.");
        RuleFor(command => command.AmountPaid)
            .GreaterThanOrEqualTo(0m)
            .Must((command, amountPaid) =>
                !Enum.IsDefined(command.RegistrationType) || amountPaid <= command.RegistrationType.GetFee())
            .WithMessage("Amount paid cannot exceed the registration fee for the selected type.");
    }
}
