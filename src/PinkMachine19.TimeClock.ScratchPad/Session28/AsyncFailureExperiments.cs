public sealed class AsyncFailureExperiments
{
    public async Task RunAsync()
    {
        Task failureTask = FailAfterDelayAsync();
        Console.WriteLine("Failure Task created.");

        try
        {
            await failureTask;
        }
        catch (InvalidOperationException exception)
        {
            Console.WriteLine($"Observed: {exception.Message}");
        }

        Console.WriteLine("Experiment continued after the catch.");
    }

    private async Task FailAfterDelayAsync()
    {
        await Task.Delay(100);
        throw new InvalidOperationException("Intentional Session 28 failure.");
    }
}
