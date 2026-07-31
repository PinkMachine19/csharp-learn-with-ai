namespace TimeLedger.Domain;

public sealed class Worker
{
    public Worker(string id, string displayName)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("A worker identifier is required.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(displayName))
        {
            throw new ArgumentException("A display name is required.", nameof(displayName));
        }

        Id = id;
        DisplayName = displayName;
    }

    public string Id { get; }

    public string DisplayName { get; }
}
