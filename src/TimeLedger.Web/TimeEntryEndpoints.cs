using Microsoft.AspNetCore.Http.HttpResults;
using TimeLedger.Domain;

namespace TimeLedger.Web;

public sealed record CreateTimeEntryDto(string WorkerId, DateTimeOffset ClockedInAt);

public static class TimeEntryEndpoints
{
    public static TimeEntry ToDomain(CreateTimeEntryDto request) => new(request.WorkerId, request.ClockedInAt);

    public static Results<Created<CreateTimeEntryDto>, ValidationProblem> Create(CreateTimeEntryDto request, ILoggerFactory loggerFactory)
    {
        Dictionary<string, string[]> errors = TimeEntryRequest.Validate(request);
        if (errors.Count > 0) return TypedResults.ValidationProblem(errors);
        loggerFactory.CreateLogger("TimeLedger.Api").LogInformation("Creating entry for worker {WorkerId}", request.WorkerId);
        _ = ToDomain(request);
        return TypedResults.Created($"/entries/{Uri.EscapeDataString(request.WorkerId)}", request);
    }
}
