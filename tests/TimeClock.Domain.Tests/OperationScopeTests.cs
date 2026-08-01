using TimeClock.Domain;

namespace TimeClock.Domain.Tests;

public sealed class OperationScopeTests
{
    [Fact]
    public void Using_disposes_after_success() { bool disposed = false; using (new OperationScope(() => disposed = true)) Assert.False(disposed); Assert.True(disposed); }

    [Fact]
    public void Using_disposes_during_exception_propagation() { bool disposed = false; Assert.Throws<InvalidOperationException>(() => ThrowInsideScope(() => disposed = true)); Assert.True(disposed); }

    private static void ThrowInsideScope(Action onDispose) { using OperationScope scope = new(onDispose); throw new InvalidOperationException("failure"); }
}
