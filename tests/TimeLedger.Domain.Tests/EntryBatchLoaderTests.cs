using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class EntryBatchLoaderTests
{
    [Fact]
    public async Task Sequential_flow_starts_one_operation_at_a_time() { int active = 0; int maximum = 0; async Task<TimeEntry> Load(string id) { active++; maximum = Math.Max(maximum, active); await Task.Yield(); active--; return new TimeEntry(id, DateTimeOffset.UnixEpoch); } await EntryBatchLoader.LoadSequentialAsync(new[] { "w1", "w2" }, Load); Assert.Equal(1, maximum); }

    [Fact]
    public async Task Concurrent_flow_starts_independent_operations_together() { TaskCompletionSource gate = new(); int started = 0; async Task<TimeEntry> Load(string id) { started++; await gate.Task; return new TimeEntry(id, DateTimeOffset.UnixEpoch); } Task<IReadOnlyList<TimeEntry>> pending = EntryBatchLoader.LoadConcurrentAsync(new[] { "w1", "w2" }, Load); await Task.Yield(); Assert.Equal(2, started); gate.SetResult(); Assert.Equal(2, (await pending).Count); }
}
