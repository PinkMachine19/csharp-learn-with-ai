namespace TimeClock.Domain;

public interface IHoursPolicy { decimal GetVariance(decimal recordedHours); }

// A new, clearly-labeled extension for Session 18 (Abstract Classes, Inheritance, and
// Overrides) -- nothing in the real practice-07092026 source uses inheritance or abstract
// classes at all. HoursPolicyBase exists to show what an abstract class adds beyond an
// interface: shared, non-abstract implementation (Round) that every derived policy inherits
// for free, alongside one abstract member (GetVariance) each derived class must still supply.
public abstract class HoursPolicyBase : IHoursPolicy
{
    public abstract decimal GetVariance(decimal recordedHours);

    // Shared implementation every derived policy inherits without repeating it.
    protected static decimal Round(decimal hours) => Math.Round(hours, 2, MidpointRounding.AwayFromZero);
}

public sealed class StandardHoursPolicy(decimal scheduledHours) : HoursPolicyBase
{
    public override decimal GetVariance(decimal recordedHours) => Round(recordedHours - scheduledHours);
}

public sealed class FlexibleHoursPolicy : HoursPolicyBase
{
    public override decimal GetVariance(decimal recordedHours) => 0m;
}
