namespace TimeClock.Domain;

public static class ClockEntryQueries
{
    public static IEnumerable<WorkSummary> LongestFirst(IEnumerable<ClockEntry> entries, decimal minimumHours) =>
        entries.Where(entry => entry.ClockOut is not null && (decimal)entry.GetDuartion().TotalHours >= minimumHours)
            .OrderByDescending(entry => entry.GetDuartion())
            .Select(entry => new WorkSummary(entry.EmployeeId, (decimal)entry.GetDuartion().TotalHours));
}
