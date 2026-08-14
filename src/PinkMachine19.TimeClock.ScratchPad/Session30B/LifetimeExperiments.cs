using Microsoft.Extensions.DependencyInjection;

public sealed class LifetimeExperiments
{
    public void Run()
    {
        ServiceCollection services = new();
        services.AddTransient<TransientMarker>();
        services.AddScoped<ScopedMarker>();
        services.AddSingleton<SingletonMarker>();

        using ServiceProvider provider = services.BuildServiceProvider();
        using IServiceScope firstScope = provider.CreateScope();
        using IServiceScope secondScope = provider.CreateScope();

        TransientMarker firstTransient = Resolve<TransientMarker>(firstScope);
        TransientMarker secondTransient = Resolve<TransientMarker>(firstScope);
        Console.WriteLine($"Transient reused in one scope: {ReferenceEquals(firstTransient, secondTransient)}");

        ScopedMarker firstScoped = Resolve<ScopedMarker>(firstScope);
        ScopedMarker repeatedScoped = Resolve<ScopedMarker>(firstScope);
        ScopedMarker secondScopeScoped = Resolve<ScopedMarker>(secondScope);
        Console.WriteLine($"Scoped reused in one scope: {ReferenceEquals(firstScoped, repeatedScoped)}");
        Console.WriteLine($"Scoped reused across scopes: {ReferenceEquals(firstScoped, secondScopeScoped)}");

        SingletonMarker firstSingleton = Resolve<SingletonMarker>(firstScope);
        SingletonMarker secondSingleton = Resolve<SingletonMarker>(secondScope);
        Console.WriteLine($"Singleton reused across scopes: {ReferenceEquals(firstSingleton, secondSingleton)}");
    }

    private static T Resolve<T>(IServiceScope scope) where T : notnull
    {
        return scope.ServiceProvider.GetRequiredService<T>();
    }

    private sealed class TransientMarker;
    private sealed class ScopedMarker;
    private sealed class SingletonMarker;
}
