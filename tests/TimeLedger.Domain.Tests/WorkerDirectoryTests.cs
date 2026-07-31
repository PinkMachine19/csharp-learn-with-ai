using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class WorkerDirectoryTests
{
    [Fact]
    public void Dictionary_rejects_duplicate_key() { WorkerDirectory d = new(); Assert.True(d.Add(new Worker("w1", "A"))); Assert.False(d.Add(new Worker("w1", "B"))); Assert.Equal(1, d.Count); }

    [Fact]
    public void Set_keeps_unique_team_names() { WorkerDirectory d = new(); d.Add(new Worker("w1", "A") { TeamName = "Platform" }); d.Add(new Worker("w2", "B") { TeamName = "platform" }); Assert.Single(d.Teams); }

    [Fact]
    public void TryFind_reports_missing_key() { WorkerDirectory d = new(); Assert.False(d.TryFind("missing", out Worker? worker)); Assert.Null(worker); }
}
