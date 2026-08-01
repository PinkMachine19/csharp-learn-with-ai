namespace TimeClock.Domain.Tests;

public sealed class EntryCompletionTests
{
    [Fact]
    public void Expected_validation_failure_is_a_result()
    {
        ClockEntry entry = new(1, DateTime.UnixEpoch);

        Result<TimeSpan> result = EntryCompletion.TryComplete(entry, DateTime.UnixEpoch.AddMinutes(-1));

        Assert.False(result.IsSuccess);
        Assert.Null(entry.ClockOut);
    }

    [Fact]
    public void Successful_completion_returns_duration()
    {
        ClockEntry entry = new(1, DateTime.UnixEpoch);

        Result<TimeSpan> result = EntryCompletion.TryComplete(entry, DateTime.UnixEpoch.AddHours(8));

        Assert.True(result.IsSuccess);
        Assert.Equal(TimeSpan.FromHours(8), result.Value);
    }

    [Fact]
    public void Invalid_programmer_argument_throws() =>
        Assert.Throws<ArgumentNullException>(() => EntryCompletion.TryComplete(null!, DateTime.UnixEpoch));
}
