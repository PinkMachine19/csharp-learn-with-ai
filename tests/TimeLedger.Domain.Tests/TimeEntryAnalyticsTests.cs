using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryAnalyticsTests
{
    [Fact]
    public void Grouping_aggregates_each_worker() { DateTimeOffset start = DateTimeOffset.UnixEpoch; TimeEntry a = Done("w1", start, 3); TimeEntry b = Done("w1", start, 4); Assert.Equal(new WorkSummary("w1", 7m), Assert.Single(TimeEntryAnalytics.HoursByWorker(new[] { a, b }))); }

    [Fact]
    public void Join_correlates_worker_with_summary() { string label = Assert.Single(TimeEntryAnalytics.WorkerLabels(new[] { new Worker("w1", "Avery") }, new[] { new WorkSummary("w1", 8m) })); Assert.Equal("Avery: 8.0", label); }

    private static TimeEntry Done(string id, DateTimeOffset start, double hours) { TimeEntry entry = new(id, start); entry.Complete(start.AddHours(hours)); return entry; }
}
