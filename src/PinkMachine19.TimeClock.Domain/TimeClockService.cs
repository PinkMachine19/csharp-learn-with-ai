namespace PinkMachine19.TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Services/PayRollService.cs verbatim (real file/class
// casing: the file is "PayRollService.cs" but the class is "PayrollService"). Constructor
// injects IEmployeeService but never calls it -- a real, dead dependency that the real xUnit
// test exercises unconfigured. CalculateTotalHours is the real LINQ Where+Sum-with-projection
// example: GetEmployeeClockEntries filters, then .Sum(x => x.GetDuartion().TotalHours)
// projects and aggregates in one line. See SOURCE_MAPPING.md.
public sealed class PayrollService
{
    private readonly IEmployeeService _employeeService;
    private readonly IClockEntryRepository _clockEntryRepository;

    public PayrollService(IEmployeeService employeeService, IClockEntryRepository clockEntryRepository)
    {
        _employeeService = employeeService;
        _clockEntryRepository = clockEntryRepository;
    }

    public double CalculateTotalHours(int employeeId, DateTime startDate, DateTime endDate)
    {
        var clockEntries = _clockEntryRepository.GetEmployeeClockEntries(employeeId, startDate, endDate);
        return clockEntries.Sum(x => x.GetDuartion().TotalHours);
    }
}
