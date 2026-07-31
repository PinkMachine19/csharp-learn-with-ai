using TimeLedger.Domain;

namespace TimeLedger.Domain.Tests;

public sealed class WorkerTests
{
    [Fact]
    public void Constructor_sets_required_properties()
    {
        Worker worker = new("worker-001", "Avery Chen");

        Assert.Equal("worker-001", worker.Id);
        Assert.Equal("Avery Chen", worker.DisplayName);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_requires_identifier(string id)
    {
        Assert.Throws<ArgumentException>(() => new Worker(id, "Avery Chen"));
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Constructor_requires_display_name(string displayName)
    {
        Assert.Throws<ArgumentException>(() => new Worker("worker-001", displayName));
    }
}
