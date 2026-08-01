using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class GenericRulesTests
{
    [Fact]
    public void Constraint_permits_comparison() => Assert.Equal(8m, GenericRules.Later(7.5m, 8m));
}
