using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeLedgerServiceTests
{
    [Fact]
    public void Injected_collaborators_drive_workflow() { RecordingRepository repository = new(); TimeLedgerService service = new(repository, new StandardHoursPolicy(8m)); TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); entry.Complete(DateTimeOffset.UnixEpoch.AddHours(7)); Result<decimal> result = service.Record(entry); Assert.True(result.IsSuccess); Assert.Equal(-1m, result.Value); Assert.Same(entry, repository.Saved); }

    [Fact]
    public void Open_entry_returns_failure_without_saving() { RecordingRepository repository = new(); TimeLedgerService service = new(repository, new FlexibleHoursPolicy()); Result<decimal> result = service.Record(new TimeEntry("w1", DateTimeOffset.UnixEpoch)); Assert.False(result.IsSuccess); Assert.Null(repository.Saved); }

    private sealed class RecordingRepository : ITimeEntryRepository { public TimeEntry? Saved { get; private set; } public void Save(TimeEntry entry) => Saved = entry; }
}
