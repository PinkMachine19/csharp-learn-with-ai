namespace TimeClock.Domain.Tests;

// Exercises ClockEntry against the real behavior mirrored from
// Parm.Practice.ConsoleApplication/Models/ClockEntry.cs: no constructor validation, the real
// exception messages (including the "clcoked" typo), and GetDuartion (typo, real) throwing on
// an open entry. See SOURCE_MAPPING.md.
public sealed class ClockEntryTests
{
    private static readonly DateTime ShiftStart = new(2026, 1, 15, 9, 0, 0);

    [Fact]
    public void New_entry_has_no_clock_out()
    {
        ClockEntry entry = new(1, ShiftStart);

        Assert.Null(entry.ClockOut);
    }

    [Fact]
    public void ClockOutEmployee_records_clock_out_and_duration()
    {
        ClockEntry entry = new(1, ShiftStart);

        entry.ClockOutEmployee(ShiftStart.AddHours(7.5));

        Assert.NotNull(entry.ClockOut);
        Assert.Equal(7.5, entry.GetDuartion().TotalHours);
    }

    [Fact]
    public void ClockOutEmployee_rejects_second_completion()
    {
        ClockEntry entry = new(1, ShiftStart);
        entry.ClockOutEmployee(ShiftStart.AddHours(8));

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(
            () => entry.ClockOutEmployee(ShiftStart.AddHours(9)));

        Assert.Equal("Employee can only clock out once", exception.Message);
    }

    [Fact]
    public void GetDuartion_rejects_open_entry()
    {
        ClockEntry entry = new(1, ShiftStart);

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(
            () => _ = entry.GetDuartion());

        Assert.Equal("Employee has not clcoked out yet", exception.Message);
    }

    [Fact]
    public void GetDuartion_returns_the_gap_between_clock_in_and_clock_out()
    {
        ClockEntry entry = new(1, ShiftStart);
        entry.ClockOutEmployee(ShiftStart.AddHours(2));

        Assert.Equal(TimeSpan.FromHours(2), entry.GetDuartion());
    }
}
