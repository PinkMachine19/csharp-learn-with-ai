using Microsoft.EntityFrameworkCore;

namespace TimeLedger.Infrastructure;

public sealed class TimeLedgerDbContext(DbContextOptions<TimeLedgerDbContext> options) : DbContext(options)
{
    public DbSet<TimeEntryEntity> TimeEntries => Set<TimeEntryEntity>();
}

public sealed class TimeEntryEntity
{
    public int Id { get; set; }
    public required string WorkerId { get; set; }
    public DateTimeOffset ClockedInAt { get; set; }
    public DateTimeOffset? ClockedOutAt { get; set; }
}
