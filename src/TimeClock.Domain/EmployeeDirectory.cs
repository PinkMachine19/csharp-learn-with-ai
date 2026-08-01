namespace TimeClock.Domain;

// A new, clearly-labeled extension used only by Sessions 10-12 (collections/lookup) --
// it is not part of the real repository, but reuses the real Employee/Address shape rather
// than the fictional TeamName property this course previously invented. See SOURCE_MAPPING.md.
public sealed class EmployeeDirectory
{
    private readonly Dictionary<int, Employee> employees = [];
    private readonly HashSet<string> cities = new(StringComparer.OrdinalIgnoreCase);

    public int Count => employees.Count;
    public IReadOnlySet<string> Cities => cities;

    public bool Add(Employee employee)
    {
        if (!employees.TryAdd(employee.EmployeeId, employee)) return false;
        if (!string.IsNullOrWhiteSpace(employee.Address.City)) cities.Add(employee.Address.City);
        return true;
    }

    public bool TryFind(int employeeId, out Employee? employee) => employees.TryGetValue(employeeId, out employee);
}
