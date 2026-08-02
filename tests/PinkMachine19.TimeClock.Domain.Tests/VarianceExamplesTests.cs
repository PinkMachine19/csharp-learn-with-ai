namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class VarianceExamplesTests
{
    [Fact]
    public void Covariant_source_can_widen_output()
    {
        ISource<Employee> employees = new SingleSource<Employee>(new Employee(1, "A", new Address()));
        ISource<object> objects = employees;
        Assert.IsType<Employee>(objects.Get());
    }

    [Fact]
    public void Contravariant_sink_can_accept_narrower_input()
    {
        CountingSink<object> all = new();
        ISink<Employee> employees = all;
        employees.Add(new Employee(1, "A", new Address()));
        Assert.Equal(1, all.Count);
    }
}
