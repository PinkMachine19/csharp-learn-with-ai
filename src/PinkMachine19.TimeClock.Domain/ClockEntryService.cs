namespace PinkMachine19.TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Services/ClockEntryService.cs verbatim. Clockout is
// a real, correct async/await example: it awaits GetClockEntry, throws when the employee is
// not clocked in, then calls ClockOutEmployee and re-saves.
public sealed class ClockEntryService : IClockEntryService
{
    private readonly IClockEntryRepository _clockEntryRepository;

    public ClockEntryService(IClockEntryRepository clockEntryRepository)
    {
        _clockEntryRepository = clockEntryRepository;
    }

    public void ClockIn(int employeeId)
    {
        ClockEntry clockEntry = new(employeeId, DateTime.Now);
        _clockEntryRepository.SaveClockEntry(clockEntry);
    }

    public async Task Clockout(int employeeId)
    {
        ClockEntry? clockEntry = await _clockEntryRepository.GetClockEntry(employeeId);

        if (clockEntry == null)
        {
            throw new InvalidOperationException("Employee is not currently clocked in ");
        }

        clockEntry.ClockOutEmployee(DateTime.Now);
        _clockEntryRepository.SaveClockEntry(clockEntry);
    }
}
