public sealed class CooperativeCancellationExperiments
{
    public async Task RunAsync()
    {
        using CancellationTokenSource cancellationSource = new();
        CancellationToken cancellationToken = cancellationSource.Token;
        Task processingTask = ProcessReportAsync(cancellationToken);

        Console.WriteLine("Cancellation requested.");
        cancellationSource.Cancel();

        try
        {
            await processingTask;
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Cancellation observed and handled.");
        }
    }

    private async Task ProcessReportAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("Report processing started.");
        await Task.Delay(2000, cancellationToken);
        Console.WriteLine("Report processing completed.");
    }
}
