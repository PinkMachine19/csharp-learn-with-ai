public sealed class SequentialConcurrentExperiments
{
    public async Task RunAsync()
    {
        Console.WriteLine("Sequential");
        await RunSequentialAsync();

        Console.WriteLine("Concurrent");
        await RunConcurrentAsync();
    }

    private async Task RunSequentialAsync()
    {
        string firstName = await LoadEmployeeNameAsync(1, 300);
        string secondName = await LoadEmployeeNameAsync(2, 100);

        Console.WriteLine($"Results: {firstName}, {secondName}");
    }

    private async Task RunConcurrentAsync()
    {
        Task<string> firstTask = LoadEmployeeNameAsync(1, 300);
        Task<string> secondTask = LoadEmployeeNameAsync(2, 100);

        string[] names = await Task.WhenAll(firstTask, secondTask);

        Console.WriteLine($"Results: {string.Join(", ", names)}");
    }

    private async Task<string> LoadEmployeeNameAsync(
        int employeeId,
        int delayMilliseconds)
    {
        Console.WriteLine($"Starting employee {employeeId}");
        await Task.Delay(delayMilliseconds);
        Console.WriteLine($"Finished employee {employeeId}");

        return $"Employee {employeeId}";
    }
}
