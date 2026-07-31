namespace TimeLedger.Domain;

public sealed class TimeEntry
{
    public TimeEntry(string workerId, DateTimeOffset clockedInAt)
    {
        if (string.IsNullOrWhiteSpace(workerId))
        {
            throw new ArgumentException("A worker identifier is required.", nameof(workerId));
        }

        WorkerId = workerId;
        ClockedInAt = clockedInAt;
    }

    public string WorkerId { get; }

    public DateTimeOffset ClockedInAt { get; }

    public DateTimeOffset? ClockedOutAt { get; private set; }

    public bool IsOpen => ClockedOutAt is null;

    public void Complete(DateTimeOffset clockedOutAt)
    {
        if (!IsOpen)
        {
            throw new InvalidOperationException("The time entry is already complete.");
        }

        if (clockedOutAt < ClockedInAt)
        {
            throw new ArgumentOutOfRangeException(
                nameof(clockedOutAt),
                "Clock-out time cannot be earlier than clock-in time.");
        }

        ClockedOutAt = clockedOutAt;
    }

    public TimeSpan GetDuration()
    {
        if (ClockedOutAt is not { } completedAt)
        {
            throw new InvalidOperationException("An open time entry has no final duration.");
        }

        return completedAt - ClockedInAt;
    }
}

