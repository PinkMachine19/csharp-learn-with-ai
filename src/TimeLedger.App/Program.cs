using TimeLedger.Domain;

DateTimeOffset shiftStart = new(2026, 1, 15, 9, 0, 0, TimeSpan.Zero);
DateTimeOffset shiftEnd = shiftStart.AddHours(8);

TimeEntry entry = new("worker-001", shiftStart);
entry.Complete(shiftEnd);

Console.WriteLine("TimeLedger sample");
Console.WriteLine($"Worker: {entry.WorkerId}");
Console.WriteLine($"Duration: {entry.GetDuration().TotalHours:F2} hours");

