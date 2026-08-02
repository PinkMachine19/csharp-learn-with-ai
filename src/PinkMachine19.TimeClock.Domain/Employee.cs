namespace PinkMachine19.TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Models/Employee.cs. Name and Address keep their
// real mutable, non-nullable-annotated shape; see SOURCE_MAPPING.md for the nullable-warning
// discussion carried over from EmployeeDto.
public sealed class Employee
{
    public string Name { get; set; }

    public Address Address { get; set; }

    public int EmployeeId { get; }

    public Employee(int employeeId, string name, Address address)
    {
        EmployeeId = employeeId;
        Name = name;
        Address = address;
    }

    public void DisplayName()
    {
        Console.WriteLine(Name);
    }

    public void Rename(string newName)
    {
        Name = newName;
    }
}
