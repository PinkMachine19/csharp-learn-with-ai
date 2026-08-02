namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class ClockEntryAnalyticsTests
{
    [Fact]
    public void Grouping_aggregates_each_employee()
    {
        DateTime start = DateTime.UnixEpoch;
        ClockEntry a = Done(1, start, 3);
        ClockEntry b = Done(1, start, 4);

        Assert.Equal(new WorkSummary(1, 7m), Assert.Single(ClockEntryAnalytics.HoursByEmployee(new[] { a, b })));
    }

    [Fact]
    public void Join_correlates_employee_with_summary()
    {
        string label = Assert.Single(ClockEntryAnalytics.EmployeeLabels(
            new[] { new Employee(1, "Avery", new Address()) },
            new[] { new WorkSummary(1, 8m) }));

        Assert.Equal("Avery: 8.0", label);
    }

    private static ClockEntry Done(int employeeId, DateTime start, double hours)
    {
        ClockEntry entry = new(employeeId, start);
        entry.ClockOutEmployee(start.AddHours(hours));
        return entry;
    }
}
