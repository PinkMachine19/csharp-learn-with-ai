namespace PinkMachine19.TimeClock.Domain;

public static class DeferredEntryQuery
{
    public static IEnumerable<ClockEntry> Completed(IEnumerable<ClockEntry> entries) => entries.Where(entry => entry.ClockOut is not null);
}
