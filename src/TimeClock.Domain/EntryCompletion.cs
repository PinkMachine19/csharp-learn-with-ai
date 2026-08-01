namespace TimeClock.Domain;

public static class EntryCompletion
{
    public static Result<TimeSpan> TryComplete(ClockEntry entry, DateTime clockOut)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.ClockOut is not null) return Result<TimeSpan>.Failure("The entry is already complete.");
        if (clockOut < entry.ClockIn) return Result<TimeSpan>.Failure("Clock-out cannot precede clock-in.");
        entry.ClockOutEmployee(clockOut);
        return Result<TimeSpan>.Success(entry.GetDuartion());
    }
}
