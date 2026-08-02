namespace PinkMachine19.TimeClock.Domain;

public sealed class Timesheet
{
    private readonly List<ClockEntry> entries = [];

    public Timesheet(Employee employee) => Employee = employee ?? throw new ArgumentNullException(nameof(employee));

    public Employee Employee { get; }
    public IReadOnlyList<ClockEntry> Entries => entries;

    public void Add(ClockEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.EmployeeId != Employee.EmployeeId) throw new ArgumentException("The entry belongs to another employee.", nameof(entry));
        entries.Add(entry);
    }
}
