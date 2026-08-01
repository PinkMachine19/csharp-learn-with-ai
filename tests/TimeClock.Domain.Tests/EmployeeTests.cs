namespace TimeClock.Domain.Tests;

// Mirrors Parm.Practice.ConsoleApplication/Models/Employee.cs. Real Employee is a simple
// mutable model with no constructor validation -- Name and Address are set, DisplayName()
// prints to the console, and Rename(newName) mutates Name.
public sealed class EmployeeTests
{
    [Fact]
    public void Constructor_sets_properties()
    {
        Address address = new() { Street = "1 Main St", City = "Springfield" };
        Employee employee = new(1, "Avery Chen", address);

        Assert.Equal(1, employee.EmployeeId);
        Assert.Equal("Avery Chen", employee.Name);
        Assert.Same(address, employee.Address);
    }

    [Fact]
    public void Rename_mutates_name_in_place()
    {
        Employee employee = new(1, "Avery Chen", new Address());

        employee.Rename("Avery Nguyen");

        Assert.Equal("Avery Nguyen", employee.Name);
    }
}
