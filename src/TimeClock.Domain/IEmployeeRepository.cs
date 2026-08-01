namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Interfaces/IEmployeeRepository.cs verbatim.
public interface IEmployeeRepository
{
    Employee GetEmployeeById(int employeeId);
}
