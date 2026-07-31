namespace TimeLedger.Domain;

public sealed class CancellableEntrySource(TimeSpan latency)
{
    public async Task<TimeEntry> LoadAsync(string workerId, CancellationToken cancellationToken)
    {
        await Task.Delay(latency, cancellationToken);
        if (workerId == "failure") throw new InvalidOperationException("The source failed.");
        return new TimeEntry(workerId, DateTimeOffset.UnixEpoch);
    }
}
