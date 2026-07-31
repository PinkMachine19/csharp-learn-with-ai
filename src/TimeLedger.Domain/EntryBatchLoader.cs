namespace TimeLedger.Domain;

public static class EntryBatchLoader
{
    public static async Task<IReadOnlyList<TimeEntry>> LoadSequentialAsync(IEnumerable<string> ids, Func<string, Task<TimeEntry>> load)
    {
        List<TimeEntry> results = [];
        foreach (string id in ids) results.Add(await load(id));
        return results;
    }

    public static async Task<IReadOnlyList<TimeEntry>> LoadConcurrentAsync(IEnumerable<string> ids, Func<string, Task<TimeEntry>> load) =>
        await Task.WhenAll(ids.Select(load));
}
