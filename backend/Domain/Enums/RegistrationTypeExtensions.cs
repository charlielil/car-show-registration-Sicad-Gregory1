namespace Domain.Enums;

public static class RegistrationTypeExtensions
{
    public static decimal GetFee(this RegistrationType registrationType) => registrationType switch
    {
        RegistrationType.Exhibitor => 1500m,
        RegistrationType.Competitor => 2500m,
        RegistrationType.VIP => 5000m,
        _ => throw new ArgumentOutOfRangeException(nameof(registrationType), registrationType, null)
    };
}
