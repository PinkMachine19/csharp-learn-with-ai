namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class EmployeeDirectoryTests
{
    [Fact]
    public void Dictionary_rejects_duplicate_key()
    {
        EmployeeDirectory directory = new();

        Assert.True(directory.Add(new Employee(1, "A", new Address())));
        Assert.False(directory.Add(new Employee(1, "B", new Address())));
        Assert.Equal(1, directory.Count);
    }

    [Fact]
    public void Set_keeps_unique_city_names()
    {
        EmployeeDirectory directory = new();

        directory.Add(new Employee(1, "A", new Address { City = "Springfield" }));
        directory.Add(new Employee(2, "B", new Address { City = "springfield" }));

        Assert.Single(directory.Cities);
    }

    [Fact]
    public void TryFind_reports_missing_key()
    {
        EmployeeDirectory directory = new();

        Assert.False(directory.TryFind(999, out Employee? employee));
        Assert.Null(employee);
    }
}
