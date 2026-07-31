namespace TimeLedger.Domain;

public sealed class WorkerDirectory
{
    private readonly Dictionary<string, Worker> workers = [];
    private readonly HashSet<string> teams = new(StringComparer.OrdinalIgnoreCase);

    public int Count => workers.Count;
    public IReadOnlySet<string> Teams => teams;

    public bool Add(Worker worker)
    {
        if (!workers.TryAdd(worker.Id, worker)) return false;
        if (worker.TeamName is not null) teams.Add(worker.TeamName);
        return true;
    }

    public bool TryFind(string id, out Worker? worker) => workers.TryGetValue(id, out worker);
}
