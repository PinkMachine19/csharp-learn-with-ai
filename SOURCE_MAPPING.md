# Source Mapping

This document supersedes `COURSE_REBUILD_PLAN.md`'s claims about content quality and
about "TimeLedger" being a justified canonical domain. It is the authoritative record of
where every session's content and code actually comes from.

## The core correction

The prior rebuild audited `practice-07092026`, noticed it existed, and then concluded no
real payroll/timekeeping application existed in the source — and invented a fictional
"TimeLedger" app instead. That conclusion was wrong. `practice-07092026` **is** a real,
if small and rough, Employee/ClockEntry/PayrollService time-clock console app plus a
broken-but-real ASP.NET Core Web API scaffold. This rebuild replaces TimeLedger with that
real domain everywhere: project names, type names, member names, real bugs and typos, and
all 34 sessions' content.

## Source repositories

- **Real application code**: `practice-07092026/src/Parm.Practice.ConsoleApplication`,
  `practice-07092026/src/Parm.Practice.WebApi`,
  `practice-07092026/tests/Parm.Practice.ConsoleApplication.Tests` (read-only, audited
  directly file by file — see the "Real code -> destination file" table below).
- **Real curriculum intent**: `csharp-refresher/course-dashboard/data/syllabus.json` (80
  steps, 163 substeps), `decisions.json` (7 entries), `concepts.json` (read-only).

## Real code -> destination file (byte-faithful ports)

These destination files are direct, verified ports of the real source files. Where the
real file has a bug, typo, or design smell, it is preserved and called out in a code
comment rather than silently fixed. Per the design established from Session 5 onward, the
**shipped repository stays in this "real, starting" state** — bugs like the unawaited
`Clockout(1)` call or the missing `IEmployeeService` Web API registration are not silently
pre-fixed in the checked-in code. Instead, the session whose lab addresses that bug walks
the learner through applying the real fix themselves; see "Real bugs and which session
fixes them" below.

| Real source file | Destination file | Preserved real quirks |
|---|---|---|
| `Models/ClockEntry.cs` | `src/TimeClock.Domain/ClockEntry.cs` | `GetDuartion()` (typo), "Employee has not clcoked out yet" (typo), "Employee can only clock out once", private `ClockOut` setter, no constructor validation |
| `Models/Employee.cs` | `src/TimeClock.Domain/Employee.cs` | mutable `Name`/`Address`, no constructor validation, `DisplayName()` writes to Console, `Rename(newName)` |
| `Models/Address.cs` | `src/TimeClock.Domain/Address.cs` | `Street`/`City` default to `""`, verbatim |
| `Dtos/EmployeeDto.cs` | `src/TimeClock.Domain/EmployeeDto.cs` | real CS8618 nullable-warning shape (no default, no constructor); this course's `TreatWarningsAsErrors` (not present in the real repo) required a documented local pragma suppression — see the file's own comment |
| `Interfaces/IClockEntryRepository.cs` | `src/TimeClock.Domain/IClockEntryRepository.cs` | the only `CancellationToken` in the codebase, unused/decorative (Session 27) |
| `Interfaces/IClockEntryService.cs` | `src/TimeClock.Domain/IClockEntryService.cs` | `ClockIn` sync, `Clockout` (lowercase o) async — casing mismatch preserved |
| `Interfaces/IEmployeeRepository.cs` | `src/TimeClock.Domain/IEmployeeRepository.cs` | verbatim |
| `Interfaces/IEmployeeServices.cs` (file plural, interface singular) | `src/TimeClock.Domain/IEmployeeService.cs` | interface name kept singular per real code; the file-name/type-name mismatch itself is called out in a comment rather than reproduced as a literal filename, since GitHub Pages content has no notion of a source filename separate from the type |
| `Repositories/ClockEntryRepository.cs` | `src/TimeClock.Domain/ClockEntryRepository.cs` | public mutable `_clockEntries` field (Session 16 fixes it in the lab), fake-async `GetClockEntry` (`Task.FromResult` over sync work, Session 25), leftover debug `for` loop printing 0-9, empty `foreach` |
| `Repositories/EmployeeRepository.cs` (class `EmployeeRepositor`, typo) | `src/TimeClock.Domain/EmployeeRepositor.cs` | class-name typo preserved, hardcoded stub ignoring its `employeeId` argument |
| `Services/ClockEntryService.cs` | `src/TimeClock.Domain/ClockEntryService.cs` | real, correct `async`/`await` `Clockout` implementation (Session 25) |
| `Services/EmployeeService.cs` | `src/TimeClock.Domain/EmployeeService.cs` | verbatim |
| `Services/PayRollService.cs` (file/class casing mismatch) | `src/TimeClock.Domain/TimeClockService.cs` (class `PayrollService`) | dead `IEmployeeService` dependency (Session 19), `.Sum(x => x.GetDuartion().TotalHours)` one-liner (Session 20) |
| `Program.cs` (console app) | `src/TimeClock.App/Program.cs` | mixed Transient/Singleton DI lifetimes (Session 29), unawaited `clockEntryService.Clockout(1)` (real CS4014, identified in Session 25, fixed in Session 27) |
| `Parm.Practice.WebApi/Program.cs` | `src/TimeClock.Web/Program.cs` | `AddControllers()`/`MapControllers()` with zero controllers (Session 32 fixes it in the lab), missing `IEmployeeService` registration (Session 33 fixes it in the lab) |
| `tests/.../PayrollServiceTest.cs` | `tests/TimeClock.Domain.Tests/PayrollServiceTests.cs` | verbatim Moq-based test, including the unconfigured `Mock<IEmployeeService>` (Session 28) |

**Deviations from byte-for-byte fidelity, and why:**
- `Console.ReadLine()` was dropped from the end of `Program.cs` — it would hang any
  non-interactive `dotnet run` in CI/build verification. Documented in the file's own
  comment.
- Real property/parameter names use `DateTime`, not `DateTimeOffset`; this matches the
  real source exactly (`DateTime.Now`, `DateTime ClockIn`, etc.).

## Real bugs and which session fixes them

The shipped repository always represents the **pre-fix, real** state — every fix below is
something the relevant session's lab has the learner apply themselves, verified by that
session's tests, not something silently pre-applied to the checked-in code:

| Real bug | Identified in | Fixed in |
|---|---|---|
| `ClockEntryRepository._clockEntries` is a public field | Session 10 | Session 16 (encapsulation) |
| `Program.cs`'s unawaited `clockEntryService.Clockout(1)` (CS4014) | Session 25 (async/await) | Session 27 (cancellation) |
| `TimeClock.Web`'s zero controllers despite `AddControllers()`/`MapControllers()` | — | Session 32 (ASP.NET Core routing) |
| `TimeClock.Web`'s missing `IEmployeeService` registration (would throw resolving `PayrollService`) | Session 32 (implicitly, by contrast with `IClockEntryService`) | Session 33 (validation/logging/API errors), proven both ways by `tests/TimeClock.Domain.Tests/WebApiRegistrationTests.cs` |

## Real code -> new, clearly-labeled extensions

Per the task brief, EF Core, working REST endpoints, and a filled-in `IEmployeeService`
Web API registration do not exist anywhere in the real source. These destination files are
new, but are built directly on the real domain and its real, documented gaps:

| Destination file | Real gap it extends |
|---|---|
| `src/TimeClock.Infrastructure/TimeClockDbContext.cs` (`PayrollDbContext`, `ClockEntryEntity`) | The real repo has no EF Core anywhere. This is "give `ClockEntryRepository` a real EF Core-backed implementation behind the same domain shape" — the exact framing the task brief calls for. Session 30 (context/entities/tracking) and Session 31 (query execution) teach it. |
| `src/TimeClock.Infrastructure/ClockEntryWorkflow.cs`, `ClockEntryDataQueries.cs` | Compose the real `EntryCompletion` validation with the new EF Core layer; no real equivalent exists. Session 34's integration capstone. |
| `src/TimeClock.Web/*` | `Parm.Practice.WebApi/Program.cs` calls `AddControllers()`/`MapControllers()` against **zero** controller classes, and never registers `IEmployeeService`/`EmployeeService`. `TimeClock.Web/Program.cs` is now a byte-faithful port of that real, broken scaffold (rebuilt from an earlier, incorrect minimal-API design — see the "TimeClock.Web decision" section below). Session 32 writes the first real controller; Session 33 fixes the real registration bug, proven by `WebApiRegistrationTests.cs`. |
| `src/TimeClock.Domain/EmployeeDirectory.cs`, `Timesheet.cs`, `ClockEntryAnalytics.cs`, `HoursPolicyBase` (in `IHoursPolicy.cs`), and other small collection/generics/variance/async teaching files | Not present in the real repo at all (it has no generics beyond framework built-ins, no variance, no records, no inheritance). These are clearly-new, small, single-purpose teaching examples that reuse the real `Employee`/`ClockEntry`/`Address` shapes (int `EmployeeId`, `DateTime` `ClockIn`/`ClockOut`, mutable `Employee.Name`) rather than inventing a second, parallel type system the way the TimeLedger rebuild's `Worker`/`TimeEntry` types did. `HoursPolicyBase` specifically exists because Session 18 (Abstract Classes/Inheritance) needed a real example, and nothing in the source app uses inheritance at all — this is explicitly the deliberate-teaching-example kind of new code, contrasted in the session itself with `PayrollDbContext`'s framework-*required* inheritance. |

## The `TimeClock.Web` decision

The task's coordinator explicitly required a decision here, not an ambiguous middle state.
**Decision: `TimeClock.Web` was rebuilt to mirror `Parm.Practice.WebApi/Program.cs`'s real,
controller-based, currently-broken shape exactly**, replacing an earlier, incorrect
minimal-API (`MapPost`) design this rebuild started with. Concretely:

- `AddControllers()`/`MapControllers()` are wired up with **zero** controller classes and no
  `Controllers/` directory — matching the real project exactly. Session 32's lab is where
  the first real controller (`ClockEntriesController`) gets written.
- `IEmployeeService`/`EmployeeService` is **not** registered, even though `PayrollService`'s
  constructor requires it — matching the real project's real, latent bug exactly. Session 33's
  lab reproduces and fixes it.
- `ClockEntryEndpoints.cs`/`ClockEntryRequest.cs` (the old minimal-API design) and their
  tests were deleted. `WebApiRegistrationTests.cs` was added: it reproduces the exact real
  DI registration graph against a plain `ServiceCollection` (no ASP.NET host needed) and
  proves both the failure (`PayrollService` resolution throws) and the one-line fix.

What was lost: the minimal-API design was simpler and had more working tests before this
change (58 vs. today's 56 — three minimal-API tests were removed, two registration tests
were added). What was gained: `TimeClock.Web` now teaches the actual, real, documented gap
the task brief specifically called out (`"a real bug to diagnose and fix as a lab, not
something to silently paper over with new fictional code"`) instead of a different,
invented API shape that had no real-source counterpart at all.

## Syllabus steps -> sessions

| Syllabus source | Sessions | Fidelity |
|---|---|---|
| Steps 1-39 (empty narrative, titles + one generic snippet only) | 1-4, 7-18 | The real syllabus has no prose to draw from here (empty `goal`/`why`/`mentalModel` fields, titles only) — every one of these sessions' prose and labs was written fresh, grounded directly in the real `ClockEntry`/`Employee`/`PayrollService` code (or, where no real code touches the topic at all — `ref`/`out`/`in`, generics, variance, inheritance — in new, clearly-labeled extensions built on the same real domain shapes). None of these sessions carry template/placeholder language; see the per-session grounding notes in each session's own `connection` field. |
| Steps 40-41 (early, now-superseded scaffolding) | Referenced in Session 5's history but not reused as authoritative | Used only as historical staging reference, per the task brief. |
| **Step 42 (Clock In) — HIGH FIDELITY** | **Session 5** | Reused near-verbatim: the 6 real substeps (constructor review -> interface -> `DateTime.Now` implementation -> save -> DI registration -> resolve/run/verify) became Session 5's lab steps directly. |
| **Step 43 (Clock Out) — HIGH FIDELITY** | **Session 6** (nullable `GetClockEntry` contract) | The real correction-trail (`Clockout` not `ClockOut`, `async Task` not `void`) is preserved in Session 6 and 19's prose as "confirmed in real code" style commentary. |
| **Step 44 (Duration & Payroll) — HIGH FIDELITY** | **Sessions 19, 20, 28** | decision-0006 (dead `IEmployeeService` dependency) grounds Session 19; the real `.Sum(x => x.GetDuartion().TotalHours)` one-liner grounds Session 20. The real xUnit/Moq test grounds Session 28. |
| **Step 45 (LINQ Basics) — HIGH FIDELITY** | **Sessions 20, 21, 22** | decision-0007's "plan vs. delivered reality" narrative (three planned stages -> two delivered methods) is Session 20's central concept; Sessions 21-22 extend it (grouping/joining, deferred execution) as clearly-labeled new material built on the same real projection. |
| **Step 46 (Error Handling) — good prose, UNEXECUTED code** | **Sessions 23, 24** | Reused the prose (throw-vs-return rule) but explicitly labeled the "name the employee in the message" proposal as Session 23's **lab**, not as delivered fact — per the task brief's explicit instruction for this step. Session 24 traces the same rule's consequences (unhandled propagation, `IDisposable`). |
| Steps 47-48 (Async/Await Fundamentals, Concurrency) | **Sessions 25, 26, 27** | Session 25 studies the real correct `Clockout` await and the real fake-async `GetClockEntry`, identifying (not fixing) the real CS4014 bug. Session 26 is a new extension (`EntryBatchLoader`) since the real app has no multi-item async operation. Session 27 fixes the real CS4014 bug and studies the real, unused `CancellationToken`. |
| Steps 63-65 (Testing, Security) | **Sessions 28, 29** | Session 28 traces the real `PayrollServiceTests.cs`. Session 29 studies the real, hand-written `RecordingRepository` fakes and decision-0005's real DI lifetimes. |
| Steps 57-61 (SQL/EF Core, assume a `PayrollDbContext` that doesn't exist) | **Sessions 30, 31** | Directional only; the actual `PayrollDbContext` built in this rebuild (see extensions table above) is new and is described as new, with the real gap (no persistence anywhere in the source app) stated explicitly. |
| Step 49 (Intro to ASP.NET Core) — stale, assumed WebApi doesn't exist | **Session 32** | Corrected: the WebApi project **does** exist, broken, exactly as the task brief describes — Session 32 is built entirely around that real, verified gap. |
| Step 62 (API boundary concepts) | **Session 33** | Grounded in the real missing-`IEmployeeService`-registration bug and `WebApiRegistrationTests.cs`. |
| Steps 40-44, 61, 65 (milestone/integration steps) | **Session 34** | Integration capstone composing Sessions 23 (validation), 27 (async, already fixed), 30-31 (EF Core), and 33 (already fixed) — confirms both real bug fixes are still in place rather than re-teaching them. |
| Steps 69-72 (interview-prep filler, company-specific) | **Omitted entirely**, per explicit task instruction | Not present anywhere in the new course. |
| `decisions.json` (7 entries) | Sessions 5, 16, 19, 20, 29 | decision-0004 (real save method is `SaveClockEntry`, not `Save`), decision-0005 (mixed DI lifetimes — Session 29), decision-0006 (dead `IEmployeeService` dependency — Session 19), decision-0007 (LINQ one-liner — Session 20) all appear as named, cited content in the relevant sessions rather than generic template prose. |

## Per-session status: all 34 deep-rewritten and verified

Every session's `connection`, `objectives`, `preQuiz`, `concept`, `lab`, `postQuiz`,
`reflections`, `whatBreaks`, and `summary` fields are grounded in one of:
1. **Real, verified source code** (quoted or paraphrased from `practice-07092026`, read
   directly file by file — not assumed from the task brief's summary).
2. **Real, verified syllabus/decision content** (`syllabus.json` steps 42-46, `decisions.json`,
   read directly), where it exists.
3. **New, explicitly-labeled extensions** of the real domain, with an honest, specific
   justification for why the new material exists (a named real gap: no EF Core, no
   controllers, no inheritance, no multi-item async operation, etc.) — never presented as
   if it were part of the real source.

No session (1 through 34) contains template/placeholder language ("The governing rule
is...", "This session establishes...", "Start by identifying...", "Follow the boundary...",
"Provide the canonical X example", etc.) — verified by an exhaustive grep across all 34
session files for these and related phrases, with zero matches as of the final commit in
this pass.

All 34 sessions pass the site's own validator (manifest schema, unique IDs, prerequisites,
11 required lesson sections, 4-8 accessible SVGs, internal links, navigation, commit-message
matching) — see `REBUILD_STATUS.md` for the exact command and its real, current output.

## What remains open, honestly

- **Session count/order** was kept at the prior rebuild's 34-session, 9-layer structure
  (see `site/data/course-manifest.json`) because that structure's *topic ordering* is sound
  and dependency-correct; only its *content* was fictional. No sessions were merged, split,
  added, or removed in this pass. A future pass could reasonably merge some of the thinner
  steps-1-39-derived sessions now that real content grounds them, but nothing requires it.
- **`TimeClock.Web`'s controller (Session 32) and DI-registration fix (Session 33) are
  taught as labs, not pre-applied to the shipped code** — consistent with every other real
  bug in this repository (see "Real bugs and which session fixes them" above). A learner
  following the course end to end will have applied every fix by Session 34; the repository
  as checked in always represents the state *before* each session's own fix.
- **No end-to-end GitHub Pages deployment check** was performed in this pass (no push was
  made, per the task's explicit instruction not to push).

See `REBUILD_STATUS.md` for exact validation commands and their real, current output.

## Session 01/02 split (post-rebuild reorganization)

After the rebuild pass documented above, original Session 1 ("Scaffolding the Solution: src,
tests, and the .sln") was judged to be teaching two separate ideas at once — project
scaffolding, and dependency-direction/architecture — and was split into two sessions so
each has one primary idea, matching the course's ~40-minute-per-session budget. This is an
**internal course reorganization**, not a re-derivation from `practice-07092026` or
`csharp-refresher`; no new source-repo material was consulted for it beyond re-reading the
real `.csproj` files already ported into this repository (`TimeClock.App.csproj`,
`TimeClock.Infrastructure.csproj`, `TimeClock.Web.csproj`, `TimeClock.Domain.csproj`,
`TimeClock.Domain.Tests.csproj`), which is what grounds the real dependency graph shown in
new Session 02.

- **New Session 01** keeps: what a solution/project is, `dotnet new` for `classlib`/
  `console`/`xunit`, why `src/`/`tests/` exist, `dotnet sln add`, `dotnet build`. It also
  gains a new section not present in the original session: scaffolding the standard,
  purpose-named folder set (`Configuration`, `Constants`, `Dtos`, `Exceptions`,
  `Extensions`, `Helpers`, `Interfaces`, `Mappings`, `Models`, `Options`, `Repositories`,
  `Requests`, `Responses`, `Services`, `Validators`) into `src/TimeClock.Domain`,
  `src/TimeClock.Infrastructure`, and `src/TimeClock.Web`, each with a tracked `README.md`
  explaining its purpose (Git does not track empty directories). These folders and READMEs
  were created for real in this repository as part of this reorganization — verified with
  `dotnet build TimeClock.sln -c Release` and `dotnet test TimeClock.sln -c Release
  --no-build`, both unchanged (0 warnings, 0 errors, 56/56 tests passing) — no C# code was
  added, moved, or renamed.
- **New Session 02** (new file, did not exist before) contains everything about project
  references and dependency direction that was previously folded into original Session 1:
  `dotnet add reference`, `ProjectReference`, why `TimeClock.App` references
  `TimeClock.Domain` and not the reverse, and layering. It expands on the original
  material rather than shortening it — it now also traces the *real* dependency graph
  (`TimeClock.App`, `TimeClock.Infrastructure`, and `TimeClock.Web` each independently
  reference `TimeClock.Domain`; `TimeClock.Domain.Tests` references all three; nothing
  references back into `Domain`), which the original session did not do, and adds two new
  SVG diagrams (`depgraph`, `layers` in `tools/build-site.mjs`) to illustrate it.
- **Mechanical consequence:** every session from original Session 2 onward shifted up by
  one (old Session 2 → new Session 3, ... old Session 34 → new Session 35). Every inline
  `"Session N"` cross-reference inside `site/data/sessions/*.json` prose was updated to the
  new numbering as part of this change. **The historical narrative earlier in this file,
  and in `REBUILD_STATUS.md`'s dated rebuild-pass sections, still uses the pre-split
  numbering that was current at the time that work was done** — e.g. "Session 27" in the
  "Real bugs and which session fixes them" table above refers to what is now **Session 28**
  (Cancellation and Asynchronous Exceptions); "Session 34" refers to what is now
  **Session 35** (the integration capstone). This document's historical sections were left
  as written rather than retroactively renumbered, consistent with how `COURSE_REBUILD_PLAN.md`
  is preserved as a historical record elsewhere in this repository. For the current,
  authoritative numbering, see `site/data/course-manifest.json`.
