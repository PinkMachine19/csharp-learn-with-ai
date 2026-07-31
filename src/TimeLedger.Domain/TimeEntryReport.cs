namespace TimeLedger.Domain;

public static class TimeEntryReport
{
    public static decimal TotalHours(IEnumerable<TimeEntry> entries)
    {
        decimal total = 0m;
        foreach (TimeEntry entry in entries) total += (decimal)entry.GetDuration().TotalHours;
        return total;
    }
}
