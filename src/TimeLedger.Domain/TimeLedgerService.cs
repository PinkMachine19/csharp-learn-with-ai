namespace TimeLedger.Domain;

public interface ITimeEntryRepository { void Save(TimeEntry entry); }

public sealed class TimeLedgerService(ITimeEntryRepository repository, IHoursPolicy policy)
{
    public Result<decimal> Record(TimeEntry entry)
    {
        ArgumentNullException.ThrowIfNull(entry);
        if (entry.IsOpen) return Result<decimal>.Failure("The entry must be complete.");
        repository.Save(entry);
        decimal hours = (decimal)entry.GetDuration().TotalHours;
        return Result<decimal>.Success(policy.GetVariance(hours));
    }
}
