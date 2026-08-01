namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Interfaces/IClockEntryRepository.cs verbatim,
// including the CancellationToken parameter that is accepted but never actually observed by
// the in-memory implementation (see ClockEntryRepository.cs and SOURCE_MAPPING.md).
public interface IClockEntryRepository
{
    void SaveClockEntry(ClockEntry clockEntry);

    Task<ClockEntry?> GetClockEntry(int employeeId, CancellationToken cancellationToken = default);

    IEnumerable<ClockEntry> GetEmployeeClockEntries(int employeeId, DateTime startDate, DateTime endDate);
}
