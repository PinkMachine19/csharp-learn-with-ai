using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryReportTests
{
    [Fact]
    public void Total_accepts_any_enumerable()
    {
        DateTimeOffset start = DateTimeOffset.UnixEpoch;
        TimeEntry first = new("w1", start); first.Complete(start.AddHours(3));
        TimeEntry second = new("w1", start); second.Complete(start.AddHours(4));
        Assert.Equal(7m, TimeEntryReport.TotalHours(new[] { first, second }));
    }
}
