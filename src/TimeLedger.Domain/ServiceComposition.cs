using Microsoft.Extensions.DependencyInjection;

namespace TimeLedger.Domain;

public static class ServiceComposition
{
    public static IServiceCollection AddTimeLedgerCore(this IServiceCollection services) =>
        services.AddScoped<EntryRecorder>().AddSingleton<IHoursPolicy, FlexibleHoursPolicy>();
}
