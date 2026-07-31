using Microsoft.AspNetCore.Http.HttpResults;
using TimeLedger.Domain;

namespace TimeLedger.Web;

public sealed record CreateTimeEntryDto(string WorkerId, DateTimeOffset ClockedInAt);

public static class TimeEntryEndpoints
{
    public static TimeEntry ToDomain(CreateTimeEntryDto request) => new(request.WorkerId, request.ClockedInAt);

    public static Created<CreateTimeEntryDto> Create(CreateTimeEntryDto request)
    {
        _ = ToDomain(request);
        return TypedResults.Created($"/entries/{Uri.EscapeDataString(request.WorkerId)}", request);
    }
}
