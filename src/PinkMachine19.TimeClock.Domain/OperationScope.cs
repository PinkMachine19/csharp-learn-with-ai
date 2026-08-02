namespace PinkMachine19.TimeClock.Domain;

public sealed class OperationScope(Action onDispose) : IDisposable
{
    private bool disposed;
    public void Dispose()
    {
        if (disposed) return;
        disposed = true;
        onDispose();
    }
}
