using Microsoft.EntityFrameworkCore;

namespace TimeClock.Infrastructure;

public static class ClockEntryDataQueries
{
    public static IQueryable<ClockEntryEntity> CompletedForEmployee(PayrollDbContext db, int employeeId) =>
        db.ClockEntries.Where(entry => entry.EmployeeId == employeeId && entry.ClockOut != null);

    public static async Task<List<ClockEntryEntity>> MaterializeAsync(IQueryable<ClockEntryEntity> query, CancellationToken cancellationToken = default)
    {
        List<ClockEntryEntity> rows = await query.ToListAsync(cancellationToken);
        return rows.OrderBy(entry => entry.ClockIn).ToList();
    }
}
