using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TimeLedger.Infrastructure;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryDataQueriesTests
{
    [Fact]
    public async Task IQueryable_executes_at_materialization_boundary()
    {
        await using SqliteConnection connection = new("Data Source=:memory:"); await connection.OpenAsync();
        DbContextOptions<TimeLedgerDbContext> options = new DbContextOptionsBuilder<TimeLedgerDbContext>().UseSqlite(connection).Options;
        await using TimeLedgerDbContext db = new(options); await db.Database.EnsureCreatedAsync();
        IQueryable<TimeEntryEntity> query = TimeEntryDataQueries.CompletedForWorker(db, "w1");
        db.TimeEntries.Add(new TimeEntryEntity { WorkerId = "w1", ClockedInAt = DateTimeOffset.UnixEpoch, ClockedOutAt = DateTimeOffset.UnixEpoch.AddHours(8) }); await db.SaveChangesAsync();
        Assert.Single(await TimeEntryDataQueries.MaterializeAsync(query));
    }
}
