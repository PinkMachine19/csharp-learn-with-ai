using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Infrastructure;

public sealed class ClockEntryWorkflow(PayrollDbContext db)
{
    public async Task<Result<WorkSummary>> RecordCompletedAsync(
        int employeeId,
        DateTime clockIn,
        DateTime clockOut,
        CancellationToken cancellationToken = default)
    {
        ClockEntry entry = new(employeeId, clockIn);
        Result<TimeSpan> completion = EntryCompletion.TryComplete(entry, clockOut);
        if (!completion.IsSuccess)
        {
            return Result<WorkSummary>.Failure(completion.Error!);
        }

        db.ClockEntries.Add(new ClockEntryEntity
        {
            EmployeeId = entry.EmployeeId,
            ClockIn = entry.ClockIn,
            ClockOut = entry.ClockOut
        });
        await db.SaveChangesAsync(cancellationToken);

        decimal hours = (decimal)completion.Value.TotalHours;
        return Result<WorkSummary>.Success(new WorkSummary(employeeId, hours));
    }
}
