namespace TimeClock.Domain;

public static class EntryBatchLoader
{
    public static async Task<IReadOnlyList<ClockEntry>> LoadSequentialAsync(IEnumerable<int> ids, Func<int, Task<ClockEntry>> load)
    {
        List<ClockEntry> results = [];
        foreach (int id in ids) results.Add(await load(id));
        return results;
    }

    public static async Task<IReadOnlyList<ClockEntry>> LoadConcurrentAsync(IEnumerable<int> ids, Func<int, Task<ClockEntry>> load) =>
        await Task.WhenAll(ids.Select(load));
}
