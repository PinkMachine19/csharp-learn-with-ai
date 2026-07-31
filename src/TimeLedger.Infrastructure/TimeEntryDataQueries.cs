using Microsoft.EntityFrameworkCore;

namespace TimeLedger.Infrastructure;

public static class TimeEntryDataQueries
{
    public static IQueryable<TimeEntryEntity> CompletedForWorker(TimeLedgerDbContext db, string workerId) =>
        db.TimeEntries.Where(entry => entry.WorkerId == workerId && entry.ClockedOutAt != null);

    public static async Task<List<TimeEntryEntity>> MaterializeAsync(IQueryable<TimeEntryEntity> query, CancellationToken cancellationToken = default)
    {
        List<TimeEntryEntity> rows = await query.ToListAsync(cancellationToken);
        return rows.OrderBy(entry => entry.ClockedInAt).ToList();
    }
}
