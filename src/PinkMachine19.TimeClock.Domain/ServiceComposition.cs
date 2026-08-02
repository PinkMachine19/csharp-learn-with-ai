using Microsoft.Extensions.DependencyInjection;

namespace PinkMachine19.TimeClock.Domain;

public static class ServiceComposition
{
    public static IServiceCollection AddTimeClockCore(this IServiceCollection services) =>
        services.AddScoped<EntryRecorder>().AddSingleton<IHoursPolicy, FlexibleHoursPolicy>();
}
