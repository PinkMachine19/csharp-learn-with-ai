using Microsoft.EntityFrameworkCore;

namespace PinkMachine19.TimeClock.Infrastructure;

public sealed class PayrollDbContext(DbContextOptions<PayrollDbContext> options) : DbContext(options)
{
    public DbSet<ClockEntryEntity> ClockEntries => Set<ClockEntryEntity>();
}

public sealed class ClockEntryEntity
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
}
