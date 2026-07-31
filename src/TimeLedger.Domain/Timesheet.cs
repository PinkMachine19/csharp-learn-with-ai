namespace TimeLedger.Domain;

public sealed class Timesheet
{
    private readonly List<TimeEntry> entries = [];

    public Timesheet(Worker worker) => Worker = worker ?? throw new ArgumentNullException(nameof(worker));

    public Worker Worker { get; }
    public IReadOnlyList<TimeEntry> Entries => entries;

    public void Add(TimeEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.WorkerId != Worker.Id) throw new ArgumentException("The entry belongs to another worker.", nameof(entry));
        entries.Add(entry);
    }
}
