namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class TimesheetTests
{
    [Fact]
    public void TryAdd_accepts_matching_entry_and_rejects_mismatched_entry()
    {
        Employee employee = new(1, "A", new Address());
        Timesheet sheet = new(employee);
        ClockEntry matchingEntry = new(1, DateTime.UnixEpoch);
        ClockEntry mismatchedEntry = new(2, DateTime.UnixEpoch);

        bool matchingAccepted = sheet.TryAdd(matchingEntry);
        bool mismatchedAccepted = sheet.TryAdd(mismatchedEntry);

        Assert.True(matchingAccepted);
        Assert.False(mismatchedAccepted);
        Assert.Same(employee, sheet.Employee);
        Assert.Equal(1, sheet.Entries.Count);
        Assert.Same(matchingEntry, sheet.Entries[0]);
    }
}
