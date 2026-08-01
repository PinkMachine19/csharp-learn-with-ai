using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using TimeClock.Domain;
using TimeClock.Infrastructure;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryWorkflowTests
{
    [Fact]
    public async Task Workflow_validates_persists_and_returns_summary()
    {
        await using SqliteConnection connection = new("Data Source=:memory:");
        await connection.OpenAsync();
        DbContextOptions<PayrollDbContext> options = new DbContextOptionsBuilder<PayrollDbContext>()
            .UseSqlite(connection)
            .Options;
        await using PayrollDbContext db = new(options);
        await db.Database.EnsureCreatedAsync();
        ClockEntryWorkflow workflow = new(db);

        Result<WorkSummary> result = await workflow.RecordCompletedAsync(
            1,
            DateTime.UnixEpoch,
            DateTime.UnixEpoch.AddHours(8));

        Assert.True(result.IsSuccess);
        Assert.Equal(new WorkSummary(1, 8m), result.Value);
        ClockEntryEntity stored = Assert.Single(await ClockEntryDataQueries.MaterializeAsync(
            ClockEntryDataQueries.CompletedForEmployee(db, 1)));
        Assert.Equal(DateTime.UnixEpoch.AddHours(8), stored.ClockOut);
    }

    [Fact]
    public async Task Workflow_does_not_persist_invalid_completion()
    {
        await using SqliteConnection connection = new("Data Source=:memory:");
        await connection.OpenAsync();
        DbContextOptions<PayrollDbContext> options = new DbContextOptionsBuilder<PayrollDbContext>()
            .UseSqlite(connection)
            .Options;
        await using PayrollDbContext db = new(options);
        await db.Database.EnsureCreatedAsync();

        Result<WorkSummary> result = await new ClockEntryWorkflow(db).RecordCompletedAsync(
            1,
            DateTime.UnixEpoch,
            DateTime.UnixEpoch.AddMinutes(-1));

        Assert.False(result.IsSuccess);
        Assert.Empty(await db.ClockEntries.ToListAsync());
    }
}
