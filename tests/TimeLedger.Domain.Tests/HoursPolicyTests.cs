using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class HoursPolicyTests
{
    [Theory]
    [InlineData(false, -0.5)]
    [InlineData(true, 0)]
    public void Caller_uses_policies_polymorphically(bool flexible, decimal expected) { IHoursPolicy policy = flexible ? new FlexibleHoursPolicy() : new StandardHoursPolicy(8m); Assert.Equal(expected, policy.GetVariance(7.5m)); }
}
