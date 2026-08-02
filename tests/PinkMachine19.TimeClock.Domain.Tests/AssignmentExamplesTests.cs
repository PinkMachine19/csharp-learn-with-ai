namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class AssignmentExamplesTests
{
    [Fact]
    public void Value_assignment_creates_an_independent_copy() =>
        Assert.Equal((8, 9), AssignmentExamples.CopyValue(8));

    [Fact]
    public void Reference_assignment_preserves_object_identity() =>
        Assert.True(AssignmentExamples.ReferencesShareIdentity(new Employee(1, "Avery", new Address())));
}
