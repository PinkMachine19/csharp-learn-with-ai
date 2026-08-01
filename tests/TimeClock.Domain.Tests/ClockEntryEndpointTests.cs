using TimeClock.Web;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryEndpointTests
{
    [Fact]
    public void Dto_maps_at_http_boundary() { DateTime start = DateTime.UnixEpoch; CreateClockEntryDto dto = new(1, start); ClockEntry entry = ClockEntryEndpoints.ToDomain(dto); Assert.Equal(1, entry.EmployeeId); Assert.Equal(start, entry.ClockIn); }
}
