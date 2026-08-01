namespace TimeClock.Domain;

public static class ParameterExamples
{
    public static void AddHour(ref decimal hours) => hours++;

    public static bool TryParseHours(string text, out decimal hours) => decimal.TryParse(text, out hours);

    public static decimal Read(in decimal hours) => hours;
}
