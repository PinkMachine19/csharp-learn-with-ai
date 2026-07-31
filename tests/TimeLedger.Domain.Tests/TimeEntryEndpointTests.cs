using TimeLedger.Web;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryEndpointTests
{
    [Fact]
    public void Dto_maps_at_http_boundary() { DateTimeOffset start = DateTimeOffset.UnixEpoch; CreateTimeEntryDto dto = new("w1", start); TimeEntry entry = TimeEntryEndpoints.ToDomain(dto); Assert.Equal("w1", entry.WorkerId); Assert.Equal(start, entry.ClockedInAt); }
}
