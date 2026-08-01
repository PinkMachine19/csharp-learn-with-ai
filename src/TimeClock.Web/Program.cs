using TimeClock.Web;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
WebApplication app = builder.Build();

app.MapPost("/entries", ClockEntryEndpoints.Create);
app.Run();

public partial class Program;
