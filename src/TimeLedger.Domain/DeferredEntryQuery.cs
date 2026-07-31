namespace TimeLedger.Domain;

public static class DeferredEntryQuery
{
    public static IEnumerable<TimeEntry> Completed(IEnumerable<TimeEntry> entries) => entries.Where(entry => !entry.IsOpen);
}
