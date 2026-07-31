using TimeLedger.Domain;

DateTimeOffset shiftStart = new(2026, 1, 15, 9, 0, 0, TimeSpan.Zero);
DateTimeOffset shiftEnd = shiftStart.AddHours(8);

Worker worker = new("worker-001", "Avery Chen");
TimeEntry entry = new(worker.Id, shiftStart);
entry.Complete(shiftEnd);

decimal scheduledHours = 7.5m;
decimal varianceHours = CalculateVariance(entry, scheduledHours);
string scheduleStatus = ClassifyVariance(varianceHours);

Console.WriteLine("TimeLedger course application");
Console.WriteLine($"Worker: {worker.DisplayName} ({entry.WorkerId})");
Console.WriteLine($"Duration: {entry.GetDuration().TotalHours:F2} hours");
Console.WriteLine($"Scheduled: {scheduledHours:F2} hours");
Console.WriteLine($"Recorded: {entry.GetDuration().TotalHours:F2} hours");
Console.WriteLine($"Variance: {varianceHours:+0.00;-0.00;0.00} hours");
Console.WriteLine($"Schedule status: {scheduleStatus}");

static decimal CalculateVariance(TimeEntry entry, decimal scheduledHours)
{
    decimal recordedHours = (decimal)entry.GetDuration().TotalHours;
    return recordedHours - scheduledHours;
}

static string ClassifyVariance(decimal varianceHours)
{
    return varianceHours switch
    {
        > 0m => "over schedule",
        < 0m => "under schedule",
        _ => "on schedule"
    };
}
