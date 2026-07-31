using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class EntryRecorderTests
{
    [Fact]
    public void Record_uses_arrange_act_assert()
    {
        RecordingRepository repository = new();
        EntryRecorder recorder = new(repository);
        TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); entry.Complete(DateTimeOffset.UnixEpoch.AddHours(8));

        recorder.Record(entry);

        Assert.Same(entry, repository.Saved);
    }

    private sealed class RecordingRepository : ITimeEntryRepository { public TimeEntry? Saved { get; private set; } public void Save(TimeEntry entry) => Saved = entry; }
}
