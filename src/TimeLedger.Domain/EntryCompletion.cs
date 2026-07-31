namespace TimeLedger.Domain;

public static class EntryCompletion
{
    public static Result<TimeSpan> TryComplete(TimeEntry entry, DateTimeOffset clockedOutAt)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (!entry.IsOpen) return Result<TimeSpan>.Failure("The entry is already complete.");
        if (clockedOutAt < entry.ClockedInAt) return Result<TimeSpan>.Failure("Clock-out cannot precede clock-in.");
        entry.Complete(clockedOutAt);
        return Result<TimeSpan>.Success(entry.GetDuration());
    }
}
