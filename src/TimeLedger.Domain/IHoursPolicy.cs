namespace TimeLedger.Domain;

public interface IHoursPolicy { decimal GetVariance(decimal recordedHours); }

public sealed class StandardHoursPolicy(decimal scheduledHours) : IHoursPolicy
{
    public decimal GetVariance(decimal recordedHours) => recordedHours - scheduledHours;
}

public sealed class FlexibleHoursPolicy : IHoursPolicy
{
    public decimal GetVariance(decimal recordedHours) => 0m;
}
