namespace PinkMachine19.TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Repositories/ClockEntryRepository.cs, including its
// real code smells: a public mutable backing field (encapsulation break), a "fake async"
// GetClockEntry that wraps synchronous work in Task.FromResult, a leftover debug loop, and an
// empty foreach. These are kept as an explicit "spot the smell" artifact -- see
// SOURCE_MAPPING.md -- rather than silently cleaned up.
public sealed class ClockEntryRepository : IClockEntryRepository
{
    public readonly List<ClockEntry> _clockEntries = new();

    public IEnumerable<ClockEntry> GetEmployeeClockEntries(int employeeId, DateTime startDate, DateTime endDate)
    {
        return _clockEntries.Where(entry =>
            entry.EmployeeId == employeeId &&
            entry.ClockOut != null &&
            entry.ClockIn >= startDate &&
            entry.ClockIn <= endDate);
    }

    public async Task<ClockEntry?> GetClockEntry(int employeeId, CancellationToken cancellationToken = default)
    {
        // Real, unexplained leftover debug loop -- kept intentionally as a lab artifact.
        for (int i = 0; i < 10; i++)
        {
            Console.WriteLine(i);
        }

        // Real, empty foreach -- also kept intentionally.
        foreach (var clockEntry in _clockEntries)
        {
        }

        return await Task.FromResult(
            _clockEntries.FirstOrDefault(entry =>
                entry.EmployeeId == employeeId && entry.ClockOut is null));
    }

    public void SaveClockEntry(ClockEntry clockEntry)
    {
        _clockEntries.Add(clockEntry);
    }
}
