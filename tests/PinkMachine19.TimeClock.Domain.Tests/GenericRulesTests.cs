using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class GenericRulesTests
{
    [Fact]
    public void Constraint_permits_comparison() => Assert.Equal(8m, GenericRules.Later(7.5m, 8m));
}
