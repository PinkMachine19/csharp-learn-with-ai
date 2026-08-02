using Microsoft.Extensions.DependencyInjection;

namespace PinkMachine19.TimeClock.Domain.Tests;

// Proves, without spinning up a full ASP.NET Core host, the real latent bug in
// Parm.Practice.WebApi/Program.cs (mirrored in PinkMachine19.TimeClock.Web/Program.cs): IEmployeeService is
// never registered, so resolving PayrollService throws. Session 32-33's lab discovers and
// fixes this exact bug against the real WebApi project; this test reproduces the same
// registration graph against a plain ServiceCollection so the bug is demonstrable in a fast
// unit test, not only by running the web host manually.
public sealed class WebApiRegistrationTests
{
    private static ServiceCollection RealWebApiRegistrationsWithoutEmployeeService()
    {
        // Mirrors PinkMachine19.TimeClock.Web/Program.cs's real registrations exactly.
        var services = new ServiceCollection();
        services.AddSingleton<IClockEntryRepository, ClockEntryRepository>();
        services.AddSingleton<IEmployeeRepository, EmployeeRepositor>();
        services.AddSingleton<IClockEntryService, ClockEntryService>();
        services.AddSingleton<PayrollService>();
        // IEmployeeService is intentionally NOT registered -- the real bug.
        return services;
    }

    [Fact]
    public void Real_WebApi_registrations_cannot_resolve_PayrollService()
    {
        using ServiceProvider provider = RealWebApiRegistrationsWithoutEmployeeService().BuildServiceProvider();

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(
            () => provider.GetRequiredService<PayrollService>());

        Assert.Contains("IEmployeeService", exception.Message);
    }

    [Fact]
    public void Registering_IEmployeeService_fixes_the_resolution()
    {
        ServiceCollection services = RealWebApiRegistrationsWithoutEmployeeService();
        services.AddSingleton<IEmployeeService, EmployeeService>();   // the real fix

        using ServiceProvider provider = services.BuildServiceProvider();

        PayrollService payrollService = provider.GetRequiredService<PayrollService>();

        Assert.NotNull(payrollService);
    }
}
