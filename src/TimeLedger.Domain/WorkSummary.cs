namespace TimeLedger.Domain;

public sealed record WorkSummary(string WorkerId, decimal Hours);

public readonly record struct WorkCode(int Year, int Sequence);
