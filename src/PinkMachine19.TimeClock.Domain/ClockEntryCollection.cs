namespace PinkMachine19.TimeClock.Domain;

public static class ClockEntryCollection
{
    public static List<ClockEntry> Completed(params ClockEntry[] entries)
    {
        List<ClockEntry> completed = [];
        foreach (ClockEntry entry in entries)
        {
            if (entry.ClockOut is not null) completed.Add(entry);
        }
        return completed;
    }
}
