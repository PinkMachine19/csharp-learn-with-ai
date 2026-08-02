using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PinkMachine19.TimeClock.Infrastructure;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class PayrollDbContextTests
{
    [Fact]
    public async Task SaveChanges_persists_tracked_entity()
    {
        await using SqliteConnection connection = new("Data Source=:memory:"); await connection.OpenAsync();
        DbContextOptions<PayrollDbContext> options = new DbContextOptionsBuilder<PayrollDbContext>().UseSqlite(connection).Options;
        await using PayrollDbContext db = new(options); await db.Database.EnsureCreatedAsync();
        ClockEntryEntity entity = new() { EmployeeId = 1, ClockIn = DateTime.UnixEpoch };
        db.ClockEntries.Add(entity); Assert.Equal(EntityState.Added, db.Entry(entity).State);
        await db.SaveChangesAsync(); Assert.Equal(EntityState.Unchanged, db.Entry(entity).State); Assert.Equal(1, await db.ClockEntries.CountAsync());
    }
}
