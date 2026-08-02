using Moq;

namespace PinkMachine19.TimeClock.Domain.Tests;

// Mirrors Parm.Practice.ConsoleApplication.Tests/PayrollServiceTest.cs verbatim: the real,
// only xUnit test in the source repository. It mocks IClockEntryRepository (configured) and
// IEmployeeService (unconfigured, unused) with Moq, demonstrating the dead IEmployeeService
// dependency called out in PayrollService.cs. See SOURCE_MAPPING.md.
public sealed class PayrollServiceTests
{
    private static DateTime At(int hour) => DateTime.Today.AddHours(hour);

    [Fact]
    public void CalculateTotalHours_SumsDurationsOfCompletedEntries()
    {
        // Arrange
        var firstShift = new ClockEntry(1, At(9));
        firstShift.ClockOutEmployee(At(11)); // 2 hours

        var secondShift = new ClockEntry(1, At(13));
        secondShift.ClockOutEmployee(At(16)); // 3 hours

        var repository = new Mock<IClockEntryRepository>();
        repository.Setup(r => r.GetEmployeeClockEntries(1, DateTime.MinValue, DateTime.MaxValue))
            .Returns(new[] { firstShift, secondShift });

        var employeeService = new Mock<IEmployeeService>();

        var payrollService = new PayrollService(employeeService.Object, repository.Object);

        // Act
        var totalHours = payrollService.CalculateTotalHours(1, DateTime.MinValue, DateTime.MaxValue);

        // Assert
        Assert.Equal(5.0, totalHours, precision: 5);
    }
}
