using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TimeLedger.Infrastructure;

namespace TimeLedger.Domain.Tests;

public sealed class TimeLedgerDbContextTests
{
    [Fact]
    public async Task SaveChanges_persists_tracked_entity()
    {
        await using SqliteConnection connection = new("Data Source=:memory:"); await connection.OpenAsync();
        DbContextOptions<TimeLedgerDbContext> options = new DbContextOptionsBuilder<TimeLedgerDbContext>().UseSqlite(connection).Options;
        await using TimeLedgerDbContext db = new(options); await db.Database.EnsureCreatedAsync();
        TimeEntryEntity entity = new() { WorkerId = "w1", ClockedInAt = DateTimeOffset.UnixEpoch };
        db.TimeEntries.Add(entity); Assert.Equal(EntityState.Added, db.Entry(entity).State);
        await db.SaveChangesAsync(); Assert.Equal(EntityState.Unchanged, db.Entry(entity).State); Assert.Equal(1, await db.TimeEntries.CountAsync());
    }
}
