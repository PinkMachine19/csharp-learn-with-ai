using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class DeferredEntryQueryTests
{
    [Fact]
    public void Deferred_query_sees_changes_before_enumeration() { List<ClockEntry> entries = []; IEnumerable<ClockEntry> query = DeferredEntryQuery.Completed(entries); ClockEntry entry = new(1, DateTime.UnixEpoch); entry.ClockOutEmployee(DateTime.UnixEpoch.AddHours(1)); entries.Add(entry); Assert.Single(query); }

    [Fact]
    public void Materialized_list_is_a_snapshot() { List<ClockEntry> entries = []; List<ClockEntry> snapshot = DeferredEntryQuery.Completed(entries).ToList(); ClockEntry entry = new(1, DateTime.UnixEpoch); entry.ClockOutEmployee(DateTime.UnixEpoch.AddHours(1)); entries.Add(entry); Assert.Empty(snapshot); }
}
