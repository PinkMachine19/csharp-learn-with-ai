using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class DeferredEntryQueryTests
{
    [Fact]
    public void Deferred_query_sees_changes_before_enumeration() { List<TimeEntry> entries = []; IEnumerable<TimeEntry> query = DeferredEntryQuery.Completed(entries); TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); entry.Complete(DateTimeOffset.UnixEpoch.AddHours(1)); entries.Add(entry); Assert.Single(query); }

    [Fact]
    public void Materialized_list_is_a_snapshot() { List<TimeEntry> entries = []; List<TimeEntry> snapshot = DeferredEntryQuery.Completed(entries).ToList(); TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); entry.Complete(DateTimeOffset.UnixEpoch.AddHours(1)); entries.Add(entry); Assert.Empty(snapshot); }
}
