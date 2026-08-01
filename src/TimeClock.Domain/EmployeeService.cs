namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Services/EmployeeService.cs verbatim.
public sealed class EmployeeService : IEmployeeService
{
    public void RenameService(Employee employee, string userName)
    {
        employee.Name = userName;
    }
}
