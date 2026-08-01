using Microsoft.Extensions.DependencyInjection;
using TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Program.cs verbatim, including its real, uncorrected
// bugs: mixed Transient/Singleton DI lifetimes, and a call to clockEntryService.Clockout(1)
// with no await -- a real CS4014 warning ("because this call is not awaited, execution of the
// current method continues before the call is completed"). The printed total is still "close
// enough to correct" only by accident: ClockIn and the fire-and-forget Clockout both run
// essentially back-to-back, so the open clock entry from ClockIn usually has not been closed by
// the time CalculateTotalHours reads it, and depending on timing GetEmployeeClockEntries may
// return zero completed entries for the requested window. See SOURCE_MAPPING.md and Session 34
// for the lab that fixes this by awaiting Clockout.
var services = new ServiceCollection();
services.AddTransient<IClockEntryService, ClockEntryService>();
services.AddSingleton<IClockEntryRepository, ClockEntryRepository>();
services.AddTransient<PayrollService>();
services.AddTransient<IEmployeeService, EmployeeService>();
var serviceProvider = services.BuildServiceProvider();

IClockEntryService clockEntryService = serviceProvider.GetRequiredService<IClockEntryService>();
PayrollService payrollService = serviceProvider.GetRequiredService<PayrollService>();

clockEntryService.ClockIn(1);
#pragma warning disable CS4014 // Real bug, kept intentionally -- see the comment above and Session 34.
clockEntryService.Clockout(1);
#pragma warning restore CS4014
var result = payrollService.CalculateTotalHours(1, DateTime.Today.AddHours(-4), DateTime.Now.AddHours(4));
Console.WriteLine($"Total hours worked: {result}");
