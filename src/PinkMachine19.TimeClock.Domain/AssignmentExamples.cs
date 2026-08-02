namespace PinkMachine19.TimeClock.Domain;

public static class AssignmentExamples
{
    public static (int Original, int Copy) CopyValue(int value)
    {
        int copy = value;
        copy++;
        return (value, copy);
    }

    public static bool ReferencesShareIdentity(Employee worker)
    {
        Employee alias = worker;
        return ReferenceEquals(worker, alias);
    }
}
