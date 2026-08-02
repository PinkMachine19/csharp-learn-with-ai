namespace PinkMachine19.TimeClock.Domain;

public abstract class TimeAdjustment
{
    public decimal Apply(decimal hours)
    {
        if (hours < 0m) throw new ArgumentOutOfRangeException(nameof(hours));
        return Adjust(hours);
    }

    protected abstract decimal Adjust(decimal hours);
}

public sealed class PercentageAdjustment(decimal percentage) : TimeAdjustment
{
    protected override decimal Adjust(decimal hours) => hours * (1m + percentage / 100m);
}
