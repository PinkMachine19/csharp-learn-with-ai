using Microsoft.AspNetCore.Http.HttpResults;
using TimeClock.Domain;

namespace TimeClock.Web;

public sealed record CreateClockEntryDto(int EmployeeId, DateTime ClockIn);

public static class ClockEntryEndpoints
{
    public static ClockEntry ToDomain(CreateClockEntryDto request) => new(request.EmployeeId, request.ClockIn);

    public static Results<Created<CreateClockEntryDto>, ValidationProblem> Create(CreateClockEntryDto request, ILoggerFactory loggerFactory)
    {
        Dictionary<string, string[]> errors = ClockEntryRequest.Validate(request);
        if (errors.Count > 0) return TypedResults.ValidationProblem(errors);
        loggerFactory.CreateLogger("TimeClock.Api").LogInformation("Creating entry for employee {EmployeeId}", request.EmployeeId);
        _ = ToDomain(request);
        return TypedResults.Created($"/entries/{request.EmployeeId}", request);
    }
}
