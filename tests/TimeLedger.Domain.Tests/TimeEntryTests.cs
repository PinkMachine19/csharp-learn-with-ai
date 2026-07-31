using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryTests
{
    private static readonly DateTimeOffset ShiftStart =
        new(2026, 1, 15, 9, 0, 0, TimeSpan.Zero);

    [Fact]
    public void New_entry_is_open()
    {
        TimeEntry entry = new("worker-001", ShiftStart);

        Assert.True(entry.IsOpen);
        Assert.Null(entry.ClockedOutAt);
    }

    [Fact]
    public void Complete_records_clock_out_and_duration()
    {
        TimeEntry entry = new("worker-001", ShiftStart);

        entry.Complete(ShiftStart.AddHours(7.5));

        Assert.False(entry.IsOpen);
        Assert.Equal(7.5, entry.GetDuration().TotalHours);
    }

    [Fact]
    public void Complete_rejects_time_before_clock_in()
    {
        TimeEntry entry = new("worker-001", ShiftStart);

        ArgumentOutOfRangeException exception = Assert.Throws<ArgumentOutOfRangeException>(
            () => entry.Complete(ShiftStart.AddMinutes(-1)));

        Assert.Equal("clockedOutAt", exception.ParamName);
        Assert.True(entry.IsOpen);
    }

    [Fact]
    public void Complete_rejects_second_completion()
    {
        TimeEntry entry = new("worker-001", ShiftStart);
        entry.Complete(ShiftStart.AddHours(8));

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(
            () => entry.Complete(ShiftStart.AddHours(9)));

        Assert.Equal("The time entry is already complete.", exception.Message);
    }

    [Fact]
    public void GetDuration_rejects_open_entry()
    {
        TimeEntry entry = new("worker-001", ShiftStart);

        InvalidOperationException exception = Assert.Throws<InvalidOperationException>(
            () => _ = entry.GetDuration());

        Assert.Equal("An open time entry has no final duration.", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_requires_worker_identifier(string workerId)
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(
            () => new TimeEntry(workerId, ShiftStart));

        Assert.Equal("workerId", exception.ParamName);
    }
}
