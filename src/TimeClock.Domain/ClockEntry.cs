namespace TimeClock.Domain;

// This type mirrors Parm.Practice.ConsoleApplication/Models/ClockEntry.cs from the
// real source repository as closely as the course's nullable/analyzer settings allow.
// GetDuartion() and the two exception messages below are verbatim, including the real typos
// ("GetDuartion", "clcoked") -- they are kept intentionally as a teaching artifact; see
// SOURCE_MAPPING.md.
public sealed class ClockEntry
{
    public int EmployeeId { get; }

    public DateTime ClockIn { get; }

    public DateTime? ClockOut { get; private set; }

    public ClockEntry(int employeeId, DateTime clockIn)
    {
        EmployeeId = employeeId;
        ClockIn = clockIn;
    }

    public void ClockOutEmployee(DateTime clockOut)
    {
        if (ClockOut != null)
        {
            throw new InvalidOperationException("Employee can only clock out once");
        }

        ClockOut = clockOut;
    }

    public TimeSpan GetDuartion()
    {
        if (ClockOut == null)
        {
            throw new InvalidOperationException("Employee has not clcoked out yet");
        }

        return ClockOut.Value - ClockIn;
    }
}
