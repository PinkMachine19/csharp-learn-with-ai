using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class CancellableEntrySourceTests
{
    [Fact]
    public async Task Cancellation_is_observed_at_await() { CancellableEntrySource source = new(TimeSpan.FromSeconds(1)); using CancellationTokenSource cancellation = new(); cancellation.Cancel(); await Assert.ThrowsAnyAsync<OperationCanceledException>(() => source.LoadAsync("w1", cancellation.Token)); }

    [Fact]
    public async Task Async_failure_is_rethrown_at_await() { CancellableEntrySource source = new(TimeSpan.Zero); InvalidOperationException error = await Assert.ThrowsAsync<InvalidOperationException>(() => source.LoadAsync("failure", CancellationToken.None)); Assert.Equal("The source failed.", error.Message); }
}
