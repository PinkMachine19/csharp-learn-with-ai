namespace TimeClock.Domain;

// Mirrors Parm.Practice.ConsoleApplication/Dtos/EmployeeDto.cs. This class deliberately
// keeps the real CS8618 "non-nullable property must contain a non-null value" warning shape:
// Name has no default and no constructor, so under <Nullable>enable</Nullable> the compiler
// flags it. Session 6 (Initialization, Nullability, and Invariants) uses this exact file as
// its worked example -- see SOURCE_MAPPING.md. Because this course repository additionally
// sets <TreatWarningsAsErrors>true</TreatWarningsAsErrors>, the warning is suppressed locally
// with a pragma and called out in prose instead of left to fail CI; the real repository does
// not set that flag and lets the warning stand.
#pragma warning disable CS8618
public sealed class EmployeeDto
{
    public string Name { get; set; }
}
#pragma warning restore CS8618
