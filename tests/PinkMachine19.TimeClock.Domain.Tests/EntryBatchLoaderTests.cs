using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class EntryBatchLoaderTests
{
    [Fact]
    public async Task Sequential_flow_starts_one_operation_at_a_time() { int active = 0; int maximum = 0; async Task<ClockEntry> Load(int id) { active++; maximum = Math.Max(maximum, active); await Task.Yield(); active--; return new ClockEntry(id, DateTime.UnixEpoch); } await EntryBatchLoader.LoadSequentialAsync(new[] { 1, 2 }, Load); Assert.Equal(1, maximum); }

    [Fact]
    public async Task Concurrent_flow_starts_independent_operations_together() { TaskCompletionSource gate = new(); int started = 0; async Task<ClockEntry> Load(int id) { started++; await gate.Task; return new ClockEntry(id, DateTime.UnixEpoch); } Task<IReadOnlyList<ClockEntry>> pending = EntryBatchLoader.LoadConcurrentAsync(new[] { 1, 2 }, Load); await Task.Yield(); Assert.Equal(2, started); gate.SetResult(); Assert.Equal(2, (await pending).Count); }
}
