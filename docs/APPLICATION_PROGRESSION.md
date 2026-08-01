# TimeClock Application Progression

## Why this domain

TimeClock is not an invented domain. It is a renamed, byte-faithful port of the real
`practice-07092026` application (`Parm.Practice.ConsoleApplication` /
`Parm.Practice.WebApi`): an `Employee`/`ClockEntry`/`PayrollService` time-clock console app.
See `SOURCE_MAPPING.md` at the repository root for the exact file-by-file mapping between
the real source and this repository, including which real bugs and typos were kept on
purpose (`GetDuartion()`, the `ClockIn`/`Clockout` casing mismatch, `EmployeeRepositor`'s
missing "y", the dead `IEmployeeService` dependency on `PayrollService`, `Program.cs`'s real
unawaited `Clockout(1)` call, and more).

The real application is small and rough on purpose — it reads like actual early-stage
project code, not a polished teaching sample — which is exactly why it is worth teaching
from directly rather than replacing with an idealized invention.

## Current solution layout

| Project | Responsibility | Real-source status |
|---|---|---|
| `TimeClock.Domain` | `ClockEntry`, `Employee`, `Address`, `EmployeeDto`, the four interfaces, their four implementations, and `PayrollService` (in `TimeClockService.cs`) are byte-faithful ports of the real source. It also holds ~20 small, clearly-new teaching-example files (generics, variance, async, collection helpers) that reuse the real domain's shape but have no real-source counterpart. | Mixed: core files real, example files new |
| `TimeClock.App` | Runs the real console workflow: `ClockIn(1)`, an unawaited `Clockout(1)` (real CS4014 bug, intentionally still present), then `CalculateTotalHours`. Reproduces the real app's near-zero printed total. | Real, verbatim behavior |
| `TimeClock.Infrastructure` | `PayrollDbContext`/`ClockEntryEntity`/`ClockEntryWorkflow` — EF Core does not exist anywhere in the real repo; this is a new, clearly-labeled extension giving `IClockEntryRepository` a real database-backed implementation. | New extension |
| `TimeClock.Web` | Minimal-API HTTP endpoints for creating a `ClockEntry`. The real `Parm.Practice.WebApi` calls `AddControllers()`/`MapControllers()` against zero controllers and never registers `IEmployeeService` (so resolving `PayrollService` from that host throws). **This project has not yet been rewritten to reproduce that real, controller-based shape and its real registration bug** — see `SOURCE_MAPPING.md`'s "Known gaps." | New extension, incomplete |
| `TimeClock.Domain.Tests` | Real, verbatim `PayrollServiceTests.cs` (Moq-based) plus tests for every real and new file above. | Mixed: real test ported, new tests added |

## Growth already reflected in the sessions

1. Sessions 1-4 introduce the solution, expressions, methods (mechanically renamed onto
   the real domain's vocabulary; no session-specific real-code grounding yet — see
   `SOURCE_MAPPING.md`).
2. Session 5 builds the real `ClockEntry`/`Employee` constructors and Step 42's Clock In
   feature end to end. Session 6 builds the real nullable `ClockOut`/`GetClockEntry`
   contract and the real `EmployeeDto` CS8618 warning.
3. Sessions 16-18 (interfaces, encapsulation, inheritance) have real grounding available
   (`IClockEntryRepository`, `IEmployeeService`) that has not yet been used to replace
   placeholder session content.
4. Session 19 builds real dependency injection from `PayrollService`'s real, documented
   dead `IEmployeeService` dependency and `Program.cs`'s real mixed DI lifetimes.
5. Sessions 20-22 build the real `.Sum(x => x.GetDuartion().TotalHours)` LINQ one-liner
   and extend it (clearly labeled as new) to grouping/joining and deferred execution.
6. Session 23 builds the real throw-vs-return pattern already implicit in
   `GetClockEntry`/`ClockOutEmployee`.
7. Session 25 reads the real, correct `Clockout` await and the real fake-async
   `GetClockEntry`, and identifies (without yet fixing) `Program.cs`'s real CS4014 bug.
   Session 34 fixes it as part of the integration capstone.
8. Session 28 traces the real `PayrollServiceTests.cs` line by line.
9. Sessions 30-33 (EF Core, ASP.NET Core) are new, clearly-labeled extensions of the real
   domain's real gaps (no data layer, broken WebApi scaffold) — not yet rewritten with that
   framing; still using placeholder content as of this writing.

Each session's manifest entry (`site/data/course-manifest.json`) and content file
(`site/data/sessions/session-NN.json`) states its exact real-source grounding, or explicitly
labels itself as a new extension, per `SOURCE_MAPPING.md`.

## Reproducibility and quality policy

- Target .NET 10 (matches the real repo's `net10.0`, `Nullable enable`, `ImplicitUsings
  enable`, `.slnx`-based solution conventions).
- Pin the SDK feature band in `global.json` while allowing later patches in that band.
- Treat compiler warnings as errors (`Directory.Build.props`) — a stricter policy than the
  real repo, which does not set this flag. Two real warnings this exposes
  (`EmployeeDto`'s CS8618, `Program.cs`'s CS4014 on the real unawaited `Clockout` call) are
  suppressed locally with a documented `#pragma warning disable`/`restore` pair and called
  out in a comment at the suppression site, rather than silently fixed or silently ignored.
  This is the one deliberate, documented exception to "do not hide warnings with
  suppressions" below — it exists specifically so the real bugs remain visible in the
  source and in session prose while still letting the solution build clean.
- Keep application output deterministic where the real app is deterministic; where it is
  not (the near-zero total-hours output caused by the real CS4014 race), reproduce that
  real nondeterminism-adjacent behavior rather than papering over it.
- Add packages only when a taught feature requires them (Moq for the real test port; EF
  Core/SQLite for the new Infrastructure extension).
- Do not hide warnings with suppressions, except the two documented, real-bug-preserving
  exceptions above.
