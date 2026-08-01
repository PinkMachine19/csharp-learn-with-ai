using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class TimeAdjustmentTests
{
    [Fact]
    public void Override_supplies_the_variable_step() { TimeAdjustment adjustment = new PercentageAdjustment(10m); Assert.Equal(8.8m, adjustment.Apply(8m)); }

    [Fact]
    public void Base_algorithm_protects_all_implementations() { TimeAdjustment adjustment = new PercentageAdjustment(10m); Assert.Throws<ArgumentOutOfRangeException>(() => adjustment.Apply(-1m)); }
}
