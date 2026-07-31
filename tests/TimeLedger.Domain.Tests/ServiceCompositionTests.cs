using Microsoft.Extensions.DependencyInjection;
using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class ServiceCompositionTests
{
    [Fact]
    public void Scoped_service_is_shared_within_scope_and_recreated_across_scopes() { ServiceCollection services = new(); services.AddSingleton<ITimeEntryRepository, RecordingRepository>(); services.AddTimeLedgerCore(); using ServiceProvider provider = services.BuildServiceProvider(); EntryRecorder first; using (IServiceScope scope = provider.CreateScope()) { first = scope.ServiceProvider.GetRequiredService<EntryRecorder>(); Assert.Same(first, scope.ServiceProvider.GetRequiredService<EntryRecorder>()); } using IServiceScope secondScope = provider.CreateScope(); Assert.NotSame(first, secondScope.ServiceProvider.GetRequiredService<EntryRecorder>()); }

    private sealed class RecordingRepository : ITimeEntryRepository { public void Save(TimeEntry entry) { } }
}
