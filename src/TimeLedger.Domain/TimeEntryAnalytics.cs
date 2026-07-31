namespace TimeLedger.Domain;

public static class TimeEntryAnalytics
{
    public static IReadOnlyList<WorkSummary> HoursByWorker(IEnumerable<TimeEntry> entries) => entries
        .Where(entry => !entry.IsOpen)
        .GroupBy(entry => entry.WorkerId)
        .Select(group => new WorkSummary(group.Key, group.Sum(entry => (decimal)entry.GetDuration().TotalHours)))
        .OrderBy(summary => summary.WorkerId)
        .ToList();

    public static IEnumerable<string> WorkerLabels(IEnumerable<Worker> workers, IEnumerable<WorkSummary> summaries) =>
        workers.Join(summaries, worker => worker.Id, summary => summary.WorkerId, (worker, summary) => $"{worker.DisplayName}: {summary.Hours:F1}");
}
