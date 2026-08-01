namespace TimeClock.Domain.Tests;

public sealed class TimesheetTests
{
    [Fact]
    public void Composition_keeps_employee_and_entries_together()
    {
        Employee employee = new(1, "A", new Address());
        Timesheet sheet = new(employee);
        ClockEntry entry = new(1, DateTime.UnixEpoch);

        sheet.Add(entry);

        Assert.Same(employee, sheet.Employee);
        Assert.Same(entry, Assert.Single(sheet.Entries));
    }

    [Fact]
    public void Encapsulation_rejects_another_employees_entry()
    {
        Timesheet sheet = new(new Employee(1, "A", new Address()));

        Assert.Throws<ArgumentException>(() => sheet.Add(new ClockEntry(2, DateTime.UnixEpoch)));
    }
}
