namespace TimeLedger.Web;

public static class TimeEntryRequest
{
    public static Dictionary<string, string[]> Validate(CreateTimeEntryDto request)
    {
        Dictionary<string, string[]> errors = [];
        if (string.IsNullOrWhiteSpace(request.WorkerId)) errors[nameof(request.WorkerId)] = ["WorkerId is required."];
        return errors;
    }
}
