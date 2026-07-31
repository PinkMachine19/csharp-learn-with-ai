using TimeLedger.Domain;

DateTimeOffset shiftStart = new(2026, 1, 15, 9, 0, 0, TimeSpan.Zero);
DateTimeOffset shiftEnd = shiftStart.AddHours(8);

TimeEntry entry = new("worker-001", shiftStart);
entry.Complete(shiftEnd);

decimal scheduledHours = 7.5m;
decimal recordedHours = (decimal)entry.GetDuration().TotalHours;
decimal varianceHours = recordedHours - scheduledHours;
string scheduleStatus = varianceHours switch
{
    > 0m => "over schedule",
    < 0m => "under schedule",
    _ => "on schedule"
};

Console.WriteLine("TimeLedger course application");
Console.WriteLine($"Worker: {entry.WorkerId}");
Console.WriteLine($"Duration: {entry.GetDuration().TotalHours:F2} hours");
Console.WriteLine($"Scheduled: {scheduledHours:F2} hours");
Console.WriteLine($"Recorded: {recordedHours:F2} hours");
Console.WriteLine($"Variance: {varianceHours:+0.00;-0.00;0.00} hours");
Console.WriteLine($"Schedule status: {scheduleStatus}");
