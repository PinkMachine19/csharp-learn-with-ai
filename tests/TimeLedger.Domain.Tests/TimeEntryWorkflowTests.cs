using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TimeLedger.Domain;
using TimeLedger.Infrastructure;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryWorkflowTests
{
    [Fact]
    public async Task Workflow_validates_persists_and_returns_summary()
    {
        await using SqliteConnection connection = new("Data Source=:memory:");
        await connection.OpenAsync();
        DbContextOptions<TimeLedgerDbContext> options = new DbContextOptionsBuilder<TimeLedgerDbContext>()
            .UseSqlite(connection)
            .Options;
        await using TimeLedgerDbContext db = new(options);
        await db.Database.EnsureCreatedAsync();
        TimeEntryWorkflow workflow = new(db);

        Result<WorkSummary> result = await workflow.RecordCompletedAsync(
            "w1",
            DateTimeOffset.UnixEpoch,
            DateTimeOffset.UnixEpoch.AddHours(8));

        Assert.True(result.IsSuccess);
        Assert.Equal(new WorkSummary("w1", 8m), result.Value);
        TimeEntryEntity stored = Assert.Single(await TimeEntryDataQueries.MaterializeAsync(
            TimeEntryDataQueries.CompletedForWorker(db, "w1")));
        Assert.Equal(DateTimeOffset.UnixEpoch.AddHours(8), stored.ClockedOutAt);
    }

    [Fact]
    public async Task Workflow_does_not_persist_invalid_completion()
    {
        await using SqliteConnection connection = new("Data Source=:memory:");
        await connection.OpenAsync();
        DbContextOptions<TimeLedgerDbContext> options = new DbContextOptionsBuilder<TimeLedgerDbContext>()
            .UseSqlite(connection)
            .Options;
        await using TimeLedgerDbContext db = new(options);
        await db.Database.EnsureCreatedAsync();

        Result<WorkSummary> result = await new TimeEntryWorkflow(db).RecordCompletedAsync(
            "w1",
            DateTimeOffset.UnixEpoch,
            DateTimeOffset.UnixEpoch.AddMinutes(-1));

        Assert.False(result.IsSuccess);
        Assert.Empty(await db.TimeEntries.ToListAsync());
    }
}
