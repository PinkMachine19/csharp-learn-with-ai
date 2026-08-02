using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PinkMachine19.TimeClock.Infrastructure;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class ClockEntryDataQueriesTests
{
    [Fact]
    public async Task IQueryable_executes_at_materialization_boundary()
    {
        await using SqliteConnection connection = new("Data Source=:memory:"); await connection.OpenAsync();
        DbContextOptions<PayrollDbContext> options = new DbContextOptionsBuilder<PayrollDbContext>().UseSqlite(connection).Options;
        await using PayrollDbContext db = new(options); await db.Database.EnsureCreatedAsync();
        IQueryable<ClockEntryEntity> query = ClockEntryDataQueries.CompletedForEmployee(db, 1);
        db.ClockEntries.Add(new ClockEntryEntity { EmployeeId = 1, ClockIn = DateTime.UnixEpoch, ClockOut = DateTime.UnixEpoch.AddHours(8) }); await db.SaveChangesAsync();
        Assert.Single(await ClockEntryDataQueries.MaterializeAsync(query));
    }
}
