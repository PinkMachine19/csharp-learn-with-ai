namespace PinkMachine19.TimeClock.Domain;

public static class ClockEntryAnalytics
{
    public static IReadOnlyList<WorkSummary> HoursByEmployee(IEnumerable<ClockEntry> entries) => entries
        .Where(entry => entry.ClockOut is not null)
        .GroupBy(entry => entry.EmployeeId)
        .Select(group => new WorkSummary(group.Key, group.Sum(entry => (decimal)entry.GetDuartion().TotalHours)))
        .OrderBy(summary => summary.EmployeeId)
        .ToList();

    public static IEnumerable<string> EmployeeLabels(IEnumerable<Employee> employees, IEnumerable<WorkSummary> summaries) =>
        employees.Join(summaries, employee => employee.EmployeeId, summary => summary.EmployeeId, (employee, summary) => $"{employee.Name}: {summary.Hours:F1}");
}
