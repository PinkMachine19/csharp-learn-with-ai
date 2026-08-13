public sealed class ResourceExperiments
{
    public void Run()
    {
        DisposalProbe probe = new();

        try
        {
            using (probe)
            {
                throw new InvalidOperationException("Intentional Session 25 failure.");
            }
        }
        catch (InvalidOperationException exception)
        {
            Console.WriteLine(exception.Message);
        }

        Console.WriteLine($"Was disposed: {probe.WasDisposed}");
    }

    private sealed class DisposalProbe : IDisposable
    {
        public bool WasDisposed { get; private set; }

        public void Dispose()
        {
            WasDisposed = true;
            Console.WriteLine("DisposalProbe cleanup ran.");
        }
    }
}
