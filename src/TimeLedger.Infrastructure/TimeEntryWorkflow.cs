using TimeLedger.Domain;

namespace TimeLedger.Infrastructure;

public sealed class TimeEntryWorkflow(TimeLedgerDbContext db)
{
    public async Task<Result<WorkSummary>> RecordCompletedAsync(
        string workerId,
        DateTimeOffset clockedInAt,
        DateTimeOffset clockedOutAt,
        CancellationToken cancellationToken = default)
    {
        TimeEntry entry = new(workerId, clockedInAt);
        Result<TimeSpan> completion = EntryCompletion.TryComplete(entry, clockedOutAt);
        if (!completion.IsSuccess)
        {
            return Result<WorkSummary>.Failure(completion.Error!);
        }

        db.TimeEntries.Add(new TimeEntryEntity
        {
            WorkerId = entry.WorkerId,
            ClockedInAt = entry.ClockedInAt,
            ClockedOutAt = entry.ClockedOutAt
        });
        await db.SaveChangesAsync(cancellationToken);

        decimal hours = (decimal)completion.Value.TotalHours;
        return Result<WorkSummary>.Success(new WorkSummary(workerId, hours));
    }
}
