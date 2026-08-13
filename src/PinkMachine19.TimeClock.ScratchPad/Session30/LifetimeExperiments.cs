using Microsoft.Extensions.DependencyInjection;

public sealed class LifetimeExperiments
{
    public void Run()
    {
        var services = new ServiceCollection();
        services.AddTransient<TransientMarker>();
        services.AddScoped<ScopedMarker>();
        services.AddSingleton<SingletonMarker>();

        using ServiceProvider provider = services.BuildServiceProvider();
        using IServiceScope firstScope = provider.CreateScope();
        using IServiceScope secondScope = provider.CreateScope();

        Console.WriteLine($"Transient reused: {ReferenceEquals(Resolve<TransientMarker>(firstScope), Resolve<TransientMarker>(firstScope))}");
        Console.WriteLine($"Scoped reused in one scope: {ReferenceEquals(Resolve<ScopedMarker>(firstScope), Resolve<ScopedMarker>(firstScope))}");
        Console.WriteLine($"Scoped reused across scopes: {ReferenceEquals(Resolve<ScopedMarker>(firstScope), Resolve<ScopedMarker>(secondScope))}");
        Console.WriteLine($"Singleton reused across scopes: {ReferenceEquals(Resolve<SingletonMarker>(firstScope), Resolve<SingletonMarker>(secondScope))}");
    }

    private static T Resolve<T>(IServiceScope scope) where T : notnull
    {
        return scope.ServiceProvider.GetRequiredService<T>();
    }

    private sealed class TransientMarker;
    private sealed class ScopedMarker;
    private sealed class SingletonMarker;
}
