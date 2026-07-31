namespace TimeLedger.Domain;

public static class TimeEntryQueries
{
    public static IEnumerable<WorkSummary> LongestFirst(IEnumerable<TimeEntry> entries, decimal minimumHours) =>
        entries.Where(entry => !entry.IsOpen && (decimal)entry.GetDuration().TotalHours >= minimumHours)
            .OrderByDescending(entry => entry.GetDuration())
            .Select(entry => new WorkSummary(entry.WorkerId, (decimal)entry.GetDuration().TotalHours));
}
