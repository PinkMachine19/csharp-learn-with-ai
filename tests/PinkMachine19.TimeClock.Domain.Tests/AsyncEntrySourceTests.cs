using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class AsyncEntrySourceTests
{
    [Fact]
    public async Task Await_returns_the_eventual_value() { ClockEntry entry = new(1, DateTime.UnixEpoch); AsyncEntrySource source = new(entry); ClockEntry loaded = await source.LoadAsync(1); Assert.Same(entry, loaded); }

    [Fact]
    public async Task Await_observes_failure() { AsyncEntrySource source = new(new ClockEntry(1, DateTime.UnixEpoch)); await Assert.ThrowsAsync<KeyNotFoundException>(() => source.LoadAsync(999)); }
}
