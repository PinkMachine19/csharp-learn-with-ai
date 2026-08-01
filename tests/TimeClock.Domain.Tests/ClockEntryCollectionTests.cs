using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryCollectionTests
{
    [Fact]
    public void Completed_enumerates_array_into_growable_list()
    {
        DateTime start = DateTime.UnixEpoch;
        ClockEntry open = new(1, start);
        ClockEntry done = new(1, start); done.ClockOutEmployee(start.AddHours(8));
        List<ClockEntry> result = ClockEntryCollection.Completed(open, done);
        Assert.Single(result); Assert.Same(done, result[0]);
    }
}
