using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class AsyncEntrySourceTests
{
    [Fact]
    public async Task Await_returns_the_eventual_value() { TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); AsyncEntrySource source = new(entry); TimeEntry loaded = await source.LoadAsync("w1"); Assert.Same(entry, loaded); }

    [Fact]
    public async Task Await_observes_failure() { AsyncEntrySource source = new(new TimeEntry("w1", DateTimeOffset.UnixEpoch)); await Assert.ThrowsAsync<KeyNotFoundException>(() => source.LoadAsync("missing")); }
}
