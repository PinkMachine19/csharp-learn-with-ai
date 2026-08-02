namespace PinkMachine19.TimeClock.Domain;

public sealed class AsyncEntrySource(ClockEntry entry)
{
    public Task<ClockEntry> LoadAsync(int employeeId)
    {
        ClockEntry result = entry.EmployeeId == employeeId
            ? entry
            : throw new KeyNotFoundException($"No entry exists for employee {employeeId}.");
        return Task.FromResult(result);
    }
}
