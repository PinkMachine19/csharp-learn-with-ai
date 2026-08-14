// This project is the course's permanent learning notebook.
// Each ScratchPad lesson adds a clearly labeled experiment without deleting earlier work.
Console.WriteLine("TimeClock ScratchPad");

ResourceExperiments session25 = new();
session25.Run();

AsyncFlowExperiments session26 = new();
await session26.RunAsync();

Console.WriteLine("Session 27");
SequentialConcurrentExperiments session27 = new();
await session27.RunAsync();

Console.WriteLine("Session 28");
AsyncFailureExperiments session28 = new();
await session28.RunAsync();

Console.WriteLine("Session 28B");
CooperativeCancellationExperiments session28B = new();
await session28B.RunAsync();

Console.WriteLine("Session 30B");
LifetimeExperiments session30B = new();
session30B.Run();
