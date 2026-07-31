using TimeLedger.Web;

namespace TimeLedger.Domain.Tests;

public sealed class TimeEntryRequestTests
{
    [Fact]
    public void Validation_returns_stable_field_error() { Dictionary<string, string[]> errors = TimeEntryRequest.Validate(new CreateTimeEntryDto(" ", DateTimeOffset.UnixEpoch)); Assert.Equal("WorkerId is required.", Assert.Single(errors["WorkerId"])); }

    [Fact]
    public void Valid_request_has_no_errors() => Assert.Empty(TimeEntryRequest.Validate(new CreateTimeEntryDto("w1", DateTimeOffset.UnixEpoch)));
}
