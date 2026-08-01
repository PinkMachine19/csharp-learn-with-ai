using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryQueriesTests
{
    [Fact]
    public void Pipeline_filters_orders_and_projects() { DateTime start = DateTime.UnixEpoch; ClockEntry shortEntry = Completed(1, start, 2); ClockEntry longEntry = Completed(2, start, 8); WorkSummary result = Assert.Single(ClockEntryQueries.LongestFirst(new[] { shortEntry, longEntry }, 4m)); Assert.Equal(new WorkSummary(2, 8m), result); }

    private static ClockEntry Completed(int employeeId, DateTime start, double hours) { ClockEntry entry = new(employeeId, start); entry.ClockOutEmployee(start.AddHours(hours)); return entry; }
}
