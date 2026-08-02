namespace PinkMachine19.TimeClock.Domain;

public sealed class EntryRecorder(IClockEntryRepository repository)
{
    public void Record(ClockEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.ClockOut is null) throw new InvalidOperationException("Only completed entries can be recorded.");
        repository.SaveClockEntry(entry);
    }
}
