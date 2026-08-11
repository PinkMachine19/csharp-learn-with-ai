namespace PinkMachine19.TimeClock.Domain;

public sealed class Timesheet
{
    private readonly List<ClockEntry> _entries = new();

    public Timesheet(Employee employee) => Employee = employee ?? throw new ArgumentNullException(nameof(employee));

    public Employee Employee { get; }
    public IReadOnlyList<ClockEntry> Entries => _entries;

    public bool TryAdd(ClockEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.EmployeeId != Employee.EmployeeId)
        {
            return false;
        }

        _entries.Add(entry);
        return true;
    }
}
