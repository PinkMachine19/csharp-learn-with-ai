using TimeClock.Domain;

// Mirrors Parm.Practice.WebApi/Program.cs verbatim, including its two real, latent bugs:
//
// 1. AddControllers()/MapControllers() are wired up against ZERO controller classes -- there
//    is no Controllers/ directory yet. Session 32's lab adds the first one,
//    ClockEntriesController, matching the real project's actual next step.
// 2. IEmployeeService/EmployeeService is never registered here, even though PayrollService's
//    constructor requires an IEmployeeService. Resolving PayrollService from this host would
//    throw InvalidOperationException at runtime -- a real bug, currently undiscovered because
//    nothing calls MapControllers' (nonexistent) endpoints. Session 33's lab discovers this by
//    trying to resolve PayrollService and watching it throw, then fixes the registration.
//
// See SOURCE_MAPPING.md for the real-source citation.
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Mirror the console app's DI wiring in the Web API host.
builder.Services.AddSingleton<IClockEntryRepository, ClockEntryRepository>();
builder.Services.AddSingleton<IEmployeeRepository, EmployeeRepositor>();
builder.Services.AddSingleton<IClockEntryService, ClockEntryService>();
builder.Services.AddSingleton<PayrollService>();
// NOTE: IEmployeeService is NOT registered here -- real, uncorrected bug, kept intentionally.

var app = builder.Build();
app.MapControllers();
app.Run();

public partial class Program;
