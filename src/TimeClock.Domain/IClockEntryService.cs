namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Interfaces/IClockEntryService.cs verbatim. Note the
// real, uncorrected casing mismatch: ClockIn is synchronous, Clockout (lowercase "out") is
// async, and neither matches ClockEntry.ClockOutEmployee's casing. See SOURCE_MAPPING.md.
public interface IClockEntryService
{
    void ClockIn(int employeeId);

    Task Clockout(int employeeId);
}
