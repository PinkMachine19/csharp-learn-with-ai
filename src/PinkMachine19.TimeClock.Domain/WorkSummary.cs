namespace PinkMachine19.TimeClock.Domain;

public sealed record WorkSummary(int EmployeeId, decimal Hours);

public readonly record struct WorkCode(int Year, int Sequence);
