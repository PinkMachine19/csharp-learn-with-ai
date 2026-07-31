using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class EntryCompletionTests
{
    [Fact]
    public void Expected_validation_failure_is_a_result() { TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); Result<TimeSpan> result = EntryCompletion.TryComplete(entry, DateTimeOffset.UnixEpoch.AddMinutes(-1)); Assert.False(result.IsSuccess); Assert.True(entry.IsOpen); }

    [Fact]
    public void Successful_completion_returns_duration() { TimeEntry entry = new("w1", DateTimeOffset.UnixEpoch); Result<TimeSpan> result = EntryCompletion.TryComplete(entry, DateTimeOffset.UnixEpoch.AddHours(8)); Assert.True(result.IsSuccess); Assert.Equal(TimeSpan.FromHours(8), result.Value); }

    [Fact]
    public void Invalid_programmer_argument_throws() => Assert.Throws<ArgumentNullException>(() => EntryCompletion.TryComplete(null!, DateTimeOffset.UnixEpoch));
}
