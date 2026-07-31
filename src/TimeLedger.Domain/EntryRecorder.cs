namespace TimeLedger.Domain;

public sealed class EntryRecorder(ITimeEntryRepository repository)
{
    public void Record(TimeEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.IsOpen) throw new InvalidOperationException("Only completed entries can be recorded.");
        repository.Save(entry);
    }
}
