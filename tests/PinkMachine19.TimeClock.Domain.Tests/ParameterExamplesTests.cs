using PinkMachine19.TimeClock.Domain;

namespace PinkMachine19.TimeClock.Domain.Tests;

public sealed class ParameterExamplesTests
{
    [Fact]
    public void Ref_can_update_callers_variable() { decimal hours = 7m; ParameterExamples.AddHour(ref hours); Assert.Equal(8m, hours); }

    [Fact]
    public void Out_assigns_a_result() { Assert.True(ParameterExamples.TryParseHours("7.5", out decimal hours)); Assert.Equal(7.5m, hours); }

    [Fact]
    public void In_reads_without_reassignment() { decimal hours = 8m; Assert.Equal(8m, ParameterExamples.Read(in hours)); }
}
