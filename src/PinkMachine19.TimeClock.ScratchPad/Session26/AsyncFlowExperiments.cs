public sealed class AsyncFlowExperiments
{
    public async Task RunAsync()
    {
        Task<string> nameTask = GetEmployeeNameAsync();

        Console.WriteLine(
            $"Before await: {nameTask.GetType().Name}");

        string employeeName = await nameTask;

        Console.WriteLine(
            $"After await: {employeeName}");
    }

    private Task<string> GetEmployeeNameAsync()
    {
        // "Parm" is already known, so no real asynchronous work occurs.
        // Task.FromResult wraps it in an already-completed Task<string>
        // so this experiment can practice Task and await.
        return Task.FromResult("Parm");
    }
}
