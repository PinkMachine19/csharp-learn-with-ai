using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class VarianceExamplesTests
{
    [Fact]
    public void Covariant_source_can_widen_output() { ISource<Worker> workers = new SingleSource<Worker>(new Worker("w1", "A")); ISource<object> objects = workers; Assert.IsType<Worker>(objects.Get()); }

    [Fact]
    public void Contravariant_sink_can_accept_narrower_input() { CountingSink<object> all = new(); ISink<Worker> workers = all; workers.Add(new Worker("w1", "A")); Assert.Equal(1, all.Count); }
}
