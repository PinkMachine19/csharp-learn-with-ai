using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimesheetTests
{
    [Fact]
    public void Composition_keeps_worker_and_entries_together() { Worker worker = new("w1", "A"); Timesheet sheet = new(worker); TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); sheet.Add(entry); Assert.Same(worker, sheet.Worker); Assert.Same(entry, Assert.Single(sheet.Entries)); }

    [Fact]
    public void Encapsulation_rejects_another_workers_entry() { Timesheet sheet = new(new Worker("w1", "A")); Assert.Throws<ArgumentException>(() => sheet.Add(new TimeEntry("w2", DateTimeOffset.UnixEpoch))); }
}
