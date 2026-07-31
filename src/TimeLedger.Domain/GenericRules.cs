namespace TimeLedger.Domain;

public static class GenericRules
{
    public static T Later<T>(T left, T right) where T : IComparable<T> => left.CompareTo(right) >= 0 ? left : right;
}
