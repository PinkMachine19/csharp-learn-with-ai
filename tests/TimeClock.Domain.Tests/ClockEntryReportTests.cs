using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryReportTests
{
    [Fact]
    public void Total_accepts_any_enumerable()
    {
        DateTime start = DateTime.UnixEpoch;
        ClockEntry first = new(1, start); first.ClockOutEmployee(start.AddHours(3));
        ClockEntry second = new(1, start); second.ClockOutEmployee(start.AddHours(4));
        Assert.Equal(7m, ClockEntryReport.TotalHours(new[] { first, second }));
    }
}
