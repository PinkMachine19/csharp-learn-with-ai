using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class ResultTests
{
    [Fact]
    public void Success_preserves_typed_value() { Result<decimal> result = Result<decimal>.Success(8m); Assert.True(result.IsSuccess); Assert.Equal(8m, result.Value); }

    [Fact]
    public void Failure_preserves_error() { Result<Worker> result = Result<Worker>.Failure("missing"); Assert.False(result.IsSuccess); Assert.Null(result.Value); Assert.Equal("missing", result.Error); }
}
