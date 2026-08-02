using Microsoft.Extensions.DependencyInjection;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class ServiceCompositionTests
{
    [Fact]
    public void Scoped_service_is_shared_within_scope_and_recreated_across_scopes()
    {
        ServiceCollection services = new();
        services.AddSingleton<IClockEntryRepository, RecordingRepository>();
        services.AddTimeClockCore();
        using ServiceProvider provider = services.BuildServiceProvider();

        EntryRecorder first;
        using (IServiceScope scope = provider.CreateScope())
        {
            first = scope.ServiceProvider.GetRequiredService<EntryRecorder>();
            Assert.Same(first, scope.ServiceProvider.GetRequiredService<EntryRecorder>());
        }

        using IServiceScope secondScope = provider.CreateScope();
        Assert.NotSame(first, secondScope.ServiceProvider.GetRequiredService<EntryRecorder>());
    }

    private sealed class RecordingRepository : IClockEntryRepository
    {
        public void SaveClockEntry(ClockEntry clockEntry)
        {
        }

        public Task<ClockEntry?> GetClockEntry(int employeeId, CancellationToken cancellationToken = default) =>
            Task.FromResult<ClockEntry?>(null);

        public IEnumerable<ClockEntry> GetEmployeeClockEntries(int employeeId, DateTime startDate, DateTime endDate) =>
            [];
    }
}
