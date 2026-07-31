namespace TimeLedger.Domain;

public static class AssignmentExamples
{
    public static (int Original, int Copy) CopyValue(int value)
    {
        int copy = value;
        copy++;
        return (value, copy);
    }

    public static bool ReferencesShareIdentity(Worker worker)
    {
        Worker alias = worker;
        return ReferenceEquals(worker, alias);
    }
}
