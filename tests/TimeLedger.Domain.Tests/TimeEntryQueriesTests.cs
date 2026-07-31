using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryQueriesTests
{
    [Fact]
    public void Pipeline_filters_orders_and_projects() { DateTimeOffset start = DateTimeOffset.UnixEpoch; TimeEntry shortEntry = Completed("w1", start, 2); TimeEntry longEntry = Completed("w2", start, 8); WorkSummary result = Assert.Single(TimeEntryQueries.LongestFirst(new[] { shortEntry, longEntry }, 4m)); Assert.Equal(new WorkSummary("w2", 8m), result); }

    private static TimeEntry Completed(string id, DateTimeOffset start, double hours) { TimeEntry entry = new(id, start); entry.Complete(start.AddHours(hours)); return entry; }
}
