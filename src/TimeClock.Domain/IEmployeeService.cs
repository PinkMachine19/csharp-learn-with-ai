namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Interfaces/IEmployeeServices.cs verbatim (the real
// file is named in the plural, "IEmployeeServices.cs", while the interface itself is singular,
// "IEmployeeService" -- this course keeps the interface name and calls out the filename
// mismatch in prose rather than reproducing it, since GitHub Pages content has no notion of a
// source filename separate from the type it documents).
public interface IEmployeeService
{
    void RenameService(Employee employee, string userName);
}
