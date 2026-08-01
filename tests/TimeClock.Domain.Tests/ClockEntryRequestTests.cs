using TimeClock.Web;

namespace TimeClock.Domain.Tests;

public sealed class ClockEntryRequestTests
{
    [Fact]
    public void Validation_returns_stable_field_error() { Dictionary<string, string[]> errors = ClockEntryRequest.Validate(new CreateClockEntryDto(0, DateTime.UnixEpoch)); Assert.Equal("EmployeeId must be a positive integer.", Assert.Single(errors["EmployeeId"])); }

    [Fact]
    public void Valid_request_has_no_errors() => Assert.Empty(ClockEntryRequest.Validate(new CreateClockEntryDto(1, DateTime.UnixEpoch)));
}
