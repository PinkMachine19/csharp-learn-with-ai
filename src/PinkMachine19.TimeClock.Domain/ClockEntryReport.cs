namespace PinkMachine19.TimeClock.Domain;

public static class ClockEntryReport
{
    public static decimal TotalHours(IEnumerable<ClockEntry> entries)
    {
        decimal total = 0m;
        foreach (ClockEntry entry in entries) total += (decimal)entry.GetDuartion().TotalHours;
        return total;
    }
}
