namespace TimeClock.Domain;

public sealed class CancellableEntrySource(TimeSpan latency)
{
    public async Task<ClockEntry> LoadAsync(int employeeId, CancellationToken cancellationToken)
    {
        await Task.Delay(latency, cancellationToken);
        if (employeeId < 0) throw new InvalidOperationException("The source failed.");
        return new ClockEntry(employeeId, DateTime.UnixEpoch);
    }
}
