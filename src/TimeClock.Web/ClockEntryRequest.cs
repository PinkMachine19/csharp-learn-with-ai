namespace TimeClock.Web;

public static class ClockEntryRequest
{
    public static Dictionary<string, string[]> Validate(CreateClockEntryDto request)
    {
        Dictionary<string, string[]> errors = [];
        if (request.EmployeeId <= 0) errors[nameof(request.EmployeeId)] = ["EmployeeId must be a positive integer."];
        return errors;
    }
}
