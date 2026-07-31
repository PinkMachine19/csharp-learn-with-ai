namespace TimeLedger.Domain;

public sealed class AsyncEntrySource(TimeEntry entry)
{
    public Task<TimeEntry> LoadAsync(string workerId)
    {
        TimeEntry result = entry.WorkerId == workerId
            ? entry
            : throw new KeyNotFoundException($"No entry exists for {workerId}.");
        return Task.FromResult(result);
    }
}
