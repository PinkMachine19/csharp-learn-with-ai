namespace TimeClock.Domain.Tests;

public sealed class EntryRecorderTests
{
    [Fact]
    public void Record_uses_arrange_act_assert()
    {
        RecordingRepository repository = new();
        EntryRecorder recorder = new(repository);
        ClockEntry entry = new(1, DateTime.UnixEpoch);
        entry.ClockOutEmployee(DateTime.UnixEpoch.AddHours(8));

        recorder.Record(entry);

        Assert.Same(entry, repository.Saved);
    }

    private sealed class RecordingRepository : IClockEntryRepository
    {
        public ClockEntry? Saved { get; private set; }

        public void SaveClockEntry(ClockEntry clockEntry) => Saved = clockEntry;

        public Task<ClockEntry?> GetClockEntry(int employeeId, CancellationToken cancellationToken = default) =>
            Task.FromResult<ClockEntry?>(null);

        public IEnumerable<ClockEntry> GetEmployeeClockEntries(int employeeId, DateTime startDate, DateTime endDate) =>
            [];
    }
}
