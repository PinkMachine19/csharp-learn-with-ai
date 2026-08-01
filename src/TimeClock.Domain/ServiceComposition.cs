using Microsoft.Extensions.DependencyInjection;

namespace TimeClock.Domain;

public static class ServiceComposition
{
    public static IServiceCollection AddTimeClockCore(this IServiceCollection services) =>
        services.AddScoped<EntryRecorder>().AddSingleton<IHoursPolicy, FlexibleHoursPolicy>();
}
