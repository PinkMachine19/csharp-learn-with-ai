namespace PinkMachine19.TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Repositories/EmployeeRepository.cs verbatim,
// including the real class-name typo "EmployeeRepositor" (missing the trailing "y") and the
// hardcoded stub that ignores its employeeId argument. See SOURCE_MAPPING.md.
public sealed class EmployeeRepositor : IEmployeeRepository
{
    public Employee GetEmployeeById(int employeeId)
    {
        return new Employee(1, "Parm", new Address());
    }
}
