namespace TimeLedger.Domain;

public static class TimeEntryCollection
{
    public static List<TimeEntry> Completed(params TimeEntry[] entries)
    {
        List<TimeEntry> completed = [];
        foreach (TimeEntry entry in entries)
        {
            if (!entry.IsOpen) completed.Add(entry);
        }
        return completed;
    }
}
