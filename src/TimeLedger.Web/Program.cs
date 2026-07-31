using TimeLedger.Web;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
WebApplication app = builder.Build();

app.MapPost("/entries", TimeEntryEndpoints.Create);
app.Run();

public partial class Program;
