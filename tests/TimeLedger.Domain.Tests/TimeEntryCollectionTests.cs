using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryCollectionTests
{
    [Fact]
    public void Completed_enumerates_array_into_growable_list()
    {
        DateTimeOffset start = DateTimeOffset.UnixEpoch;
        TimeEntry open = new("w1", start);
        TimeEntry done = new("w1", start); done.Complete(start.AddHours(8));
        List<TimeEntry> result = TimeEntryCollection.Completed(open, done);
        Assert.Single(result); Assert.Same(done, result[0]);
    }
}
