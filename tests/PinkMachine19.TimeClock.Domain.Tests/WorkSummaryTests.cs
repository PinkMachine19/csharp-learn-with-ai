using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class WorkSummaryTests
{
    [Fact]
    public void Equal_records_compare_by_value() => Assert.Equal(new WorkSummary(1, 8m), new WorkSummary(1, 8m));

    [Fact]
    public void Record_struct_assignment_copies_value() { WorkCode first = new(2026, 7); WorkCode second = first with { Sequence = 8 }; Assert.Equal(7, first.Sequence); Assert.Equal(8, second.Sequence); }

    [Fact]
    public void String_operation_returns_new_value() { string original = "time"; string upper = original.ToUpperInvariant(); Assert.Equal("time", original); Assert.Equal("TIME", upper); }
}
