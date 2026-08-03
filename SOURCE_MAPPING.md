# Source Mapping

This document supersedes `COURSE_REBUILD_PLAN.md`'s claims about content quality and
about "TimeLedger" being a justified canonical domain. It is the authoritative record of
where every session's content and code actually comes from.

## Fourth post-rebuild update: PinkMachine19 company-prefix convention (current)

Every project, namespace, and assembly in the solution was given the `PinkMachine19.`
prefix, per the course author's instruction to teach the real enterprise convention of
grouping related projects under a company/product prefix from the very first session,
rather than retrofitting it later.

**What changed, mechanically:**
- Solution and project renames: `TimeClock.sln` -> `PinkMachine19.TimeClock.sln`;
  `src/TimeClock.Domain` -> `src/PinkMachine19.TimeClock.Domain`; same pattern for
  `TimeClock.App`, `TimeClock.Infrastructure`, `TimeClock.Web`, and
  `tests/TimeClock.Domain.Tests` -> `tests/PinkMachine19.TimeClock.Domain.Tests`. Every
  `.csproj` was renamed to match its folder, and every `<ProjectReference>` relative path
  and the `.sln`'s project entries were updated to the new paths. Each `.csproj` also
  gained an explicit `<RootNamespace>`/`<AssemblyName>` set to the full prefixed name,
  rather than relying on the SDK's filename-derived default, so the assembly identity is
  unambiguous even if a project is ever renamed on disk again.
- Namespaces: contrary to this task's own starting assumption that no `.cs` file declared
  a namespace, every file already had one (`namespace TimeClock.Domain;`,
  `TimeClock.Infrastructure;`, `TimeClock.Domain.Tests;` — file-scoped, modern style).
  Since no project has Models/Interfaces/Services-style subfolders yet (the folders added
  in the Session 01 project-organization lab are empty except for their README.md
  placeholders), one flat namespace per project was correct and sufficient — there was no
  real subfolder structure to mirror with sub-namespaces. Every `namespace` declaration and
  every `using TimeClock.X;` directive was mechanically renamed to
  `PinkMachine19.TimeClock.X`. No type name changed. `src/PinkMachine19.TimeClock.App` and
  `src/PinkMachine19.TimeClock.Web`'s `Program.cs` files use top-level statements and stay
  in the implicit global namespace, as C# requires — this is unrelated to the prefix and
  was left alone.
- `dotnet new sln` on the SDK pinned by `global.json` (10.0.302) defaults to the newer
  `.slnx` format, not the classic `.sln` format this repository actually uses. Session 01's
  lab and lesson text for `dotnet new sln -n TimeClock` were updated to
  `dotnet new sln -n PinkMachine19.TimeClock -f sln`, both renaming the solution and adding
  the explicit format flag needed to reproduce this repository's actual `.sln` file — an
  accuracy gap discovered while re-running the command for this pass, not something
  introduced by it.
- All 36 session JSON files (`session-00.json` through `session-35.json`) had every
  `TimeClock.Domain`/`TimeClock.App`/`TimeClock.Infrastructure`/`TimeClock.Web`/
  `TimeClock.Domain.Tests`/`TimeClock.sln` reference renamed in prose, code blocks, lab
  steps, `expectedFiles` paths, and `commit` messages. Casual, non-identifier mentions of
  "TimeClock" as the name of the course's running example application (e.g. "Every real
  project in TimeClock points at Domain") were deliberately left as-is, matching how real
  engineering docs refer to a codebase by its informal name without spelling out the full
  company-prefixed identifier every time.
- `README.md`'s repository-areas list and build/run commands were updated to the new
  paths and solution name. `course-manifest.json` and `tools/build-site.mjs`/
  `tools/validate-site.mjs` had no hardcoded `TimeClock.*` references to begin with.
- Per an explicit correction from the course author mid-pass, no real or fictional company
  name (including "Microsoft" or "RapidFinance") appears anywhere in learner-facing content
  as an illustrative comparison for the naming convention. `PinkMachine19` is the only
  organization name used in the course; a grep across the diff confirmed no such comparison
  text was ever introduced. `Microsoft.Extensions.*`, `Microsoft.NET.Sdk`,
  `Microsoft.EntityFrameworkCore.*`, and `Microsoft.AspNetCore.*` remain untouched, since
  those are real, necessary package/SDK identifiers, not naming-convention examples.

**Verification performed:** `dotnet build PinkMachine19.TimeClock.sln -c Release` (0
warnings, 0 errors) and `dotnet test PinkMachine19.TimeClock.sln -c Release --no-build`
(56/56 tests passing) both succeeded immediately after the rename — the pre-existing
namespaces meant no cross-project `using` fixes were actually needed beyond the mechanical
rename itself. `npm run build && npm run validate` passed against all 36 updated session
files (`Validated 114 HTML pages and 36 manifest sessions`). The `dotnet new sln`/
`dotnet sln add`/`dotnet build`/`dotnet sln list` sequence documented in Session 01 and
Session 02 was re-run end to end in a scratch folder and against this repository, and its
real output (project lists, build success) matches what the lesson text now shows. A final
repository-wide grep for any remaining unprefixed `TimeClock.Domain`/`TimeClock.App`/
`TimeClock.Infrastructure`/`TimeClock.Web`/`TimeClock.Domain.Tests`/`TimeClock.sln`
reference across both the .NET code and `site/data/sessions/*.json` returned nothing,
outside of this file's, `REBUILD_STATUS.md`'s, and `COURSE_REBUILD_PLAN.md`'s historical
narrative describing what things were called before this pass, which is intentionally left
unchanged.

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

  (Note: the numbering described in this section was itself superseded again by the Session
  00 addition documented immediately below — the session referred to here as "new Session 01"
  is now **Session 02**, and "new Session 02" is now **Session 03**.)

## Session 00 addition: a new, non-technical opening chapter

After the 01/02 split documented above (35 sessions, 9 layers), a new **Session 00** —
"Why Learn C# in 2026?" — was added as the course's permanent opening chapter. Unlike every
other session, it is **original orientation material written for this task, not derived from
`practice-07092026` or `csharp-refresher`**. There is no real source to map it to, and this
section says so plainly rather than inventing a fictional syllabus-step mapping the way the
old TimeLedger rebuild invented `TimeLedger` — `site/data/sessions/session-00.json`'s
`migrationSource` field in `course-manifest.json` states this directly.

**What it is:** a motivational, orientational session with no C# syntax and no code to write.
It answers "if Python and JavaScript are everywhere, why should anyone still learn C#?" by
explaining that visible tutorial/AI-example content skews toward scripting and web languages
for reasons that have nothing to do with professional usage, that a large enterprise ecosystem
(finance, insurance, healthcare, logistics, government, enterprise SaaS) runs substantially on
C#/.NET largely out of view of that content, that real production systems are polyglot by
design (C# APIs, TypeScript/JavaScript frontends, SQL Server, Redis, Azure, Docker,
Kubernetes, Python automation/analytics, CI/CD — collaborating, not competing), and why
organizations keep choosing C# for concrete engineering reasons (static typing, compile-time
safety, tooling maturity, performance, cross-platform support, NuGet, long-term
maintainability). Its mental model, "Languages are tools. Systems are ecosystems.," is the
session's visual centerpiece. Its lab has no code: the student hand-writes
`foundation-notes.md`, a personal notebook with five required sections, establishing this
course's "if your hands aren't moving, you're probably not learning" habit from session one.

**Why session number 1 is intentionally unused:** the task brief specified, in explicit,
repeated, procedural detail (an exact rename algorithm — "rename in descending order,
35→36 first, down to 01→02, to avoid collisions" — stated twice, once in the task's opening
paragraph and once in its mechanical-consequences list), that every existing session 01–35
should shift up by one to become 02–36, with the new session occupying 00. That produces a
final numbering of 0, then 2 through 36 — session number 1 is not reused by anything. A
different, more minimal reading was also present elsewhere in the same brief (an aside
suggesting the old Session 01 "slots in" and "is still numbered 01"), which would have
avoided the gap entirely by leaving 01–35 untouched and only adding 00 in front. These two
readings directly conflict. The literal, twice-stated rename algorithm was treated as
authoritative because (a) a collision-avoidance rename order is only meaningful if a real
shift and real renames are happening — there's nothing to collide with if 00 is simply added
in front of an unchanged 01–35 — and (b) the brief separately calls out that the session right
after Session 00 needs an *explicit* prerequisite of `0` rather than following the standard
`prerequisite = number − 1` pattern, which is only a meaningful, non-trivial thing to call out
if that session's number is 2 (where the standard pattern would otherwise incorrectly compute
prerequisite `1`, a number that no longer exists) — under the non-shifting reading, prerequisite
`0` falls out of the standard formula automatically for a session still numbered `1`, making
the special-case callout pointless. Both signals point the same direction, so the full shift
was implemented. This is called out explicitly here, per the task's own instruction to make a
defensible, documented judgment call rather than pause for clarification on a genuine
in-brief contradiction.

**Correction (post-review):** on review, retiring session number 1 was the wrong call —
a public course with no "Session 01," jumping straight from 00 to 02, reads as a bug to
any visitor regardless of which internal instruction technically justified it. The gap was
unnecessary in the first place: 0 fits before 1 without requiring any renumbering at all,
since nothing was ever using slot 0 before. The fix: sessions 01–35 were restored verbatim
(content, not just numbers) from the pre-Session-00 commit, session-36.json was deleted (its
content is identical to the restored session-35.json), and the manifest/validator were
updated for plain contiguous 0–35 numbering with a standard `prerequisite = number − 1`
pattern throughout (session 1's prerequisite is simply `0`, no special case needed). The
"mechanical consequences applied" section below describes the intermediate 0,2–36 state that
existed briefly before this correction, kept here for an accurate history rather than
silently rewritten.

**Mechanical consequences applied:**
- Every session file from `session-01.json` (34 through 01, in that descending order) shifted
  up by one, `session-01.json` → `session-02.json`, ..., `session-35.json` → `session-36.json`,
  including each file's own `"number"` field and every in-prose `"Session N"` / `"Sessions
  N–M"` / `"session-NN"` cross-reference, applied by a small, verified Node script rather than
  by hand (36 files, hundreds of cross-references). A pre-existing, unrelated quirk from the
  01/02 split — several sessions' own `commit`/`expectedFiles` self-references were already
  one number behind their actual filename (e.g. old `session-04.json`'s commit said
  `session-03: ...`) — was **preserved, not fixed**, by the same uniform shift; fixing it was
  out of scope for this task and the shift does not make it worse.
- `course-manifest.json`: `sessionCount` 35 → 36; a new single-session `"orientation"` layer
  (number 1, range `00`) was added ahead of the existing nine layers, each of which had its
  `number` incremented and its `range` shifted by one session to match (e.g. `foundations`
  moved from `01–07` to `02–08`). The `sessions` array gained a new `[0, ...]` row with
  `prerequisite: null` and every subsequent row's `number` and `prerequisite` were
  recomputed (`prerequisite = null` for 0, `prerequisite = 0` for the session immediately
  after it, `prerequisite = number − 1` for every session after that — unchanged from the
  existing pattern, just shifted).
- `tools/build-site.mjs`: the session-detail page's previous/next navigation previously
  computed neighbors by number arithmetic (`sessions[session.number - 2]` /
  `sessions[session.number]`), which assumed contiguous numbering. That assumption is now
  false (number 1 doesn't exist), so navigation was rewritten to walk the `sessions` array by
  position instead. Separately, the syllabus table's prerequisite column used
  `session.prerequisiteSession ? ... : "None"` — a real bug exposed by this change, since `0`
  is falsy in JavaScript and Session 02's real prerequisite of `0` would have silently
  rendered as "None." Fixed to an explicit `null`/`undefined` check. Four new inline SVG
  `diagram()` kinds were added for Session 00 — `toolbelt`, `skew`, `ecosystem`, `stack` —
  rather than reusing existing kinds, because every existing diagram has baked-in text labels
  from its original TimeClock-domain lesson (e.g. `solution`'s "app"/"core"/"tests") that
  would have been actively misleading in a non-technical orientation session about languages
  and ecosystems.
- `tools/validate-site.mjs`: the layer-count check (`layers.length !== 9`) became `!== 10`;
  the session-sequence check, which assumed `number === index + 1` for every session, was
  rewritten to expect `0` at index 0 and `index + 1` from index 1 onward, with prerequisite
  `0` explicitly expected at index 1 instead of the standard `expected − 1` formula.
- `README.md`, `REBUILD_STATUS.md`: updated session counts (35 → 36) and this section's
  cross-reference, following the same pattern the 01/02 split used — new, dated sections
  added at the top, older sections left with their original numbering intact and explicitly
  labeled as historical.

**Verification performed:** `npm run build && npm run validate` pass against the new
36-session structure (`Validated 114 HTML pages and 36 manifest sessions`). `dotnet build
TimeClock.sln -c Release` and `dotnet test TimeClock.sln -c Release --no-build` are unchanged
(0 warnings, 0 errors, 56/56 tests passing) — this task added no C# code. Session 00 was
browser-verified directly against a locally served build: all 11 fixed lesson sections render,
its 4 new SVGs pass the same `role="img"`/`title`/`desc` accessibility contract as every other
diagram, the quiz check-answer and reveal-card interactions both work, session navigation
correctly reads Session 00 → Session 02 → Session 03 (and Session 02's "previous" link points
back to Session 00), and the syllabus page lists Session 00 first with the new "Orientation
and Context" layer and prerequisite "None." A full `grep` across `site/data/sessions/*.json`
for stray `"Session N"` references outside the valid 0/2–36 range came back empty.

## Sessions 00.5 and 00.6 addition

Session 00.5 ("Product Overview & Requirements") and Session 00.6 ("From Requirements to
Domain Model") were inserted between Session 00 and Session 01 without renumbering the
existing integer-numbered sessions. Their provenance is the verified source mapping in this
document plus direct review of the current destination code and tests.

- Session 00.5 limits current product behavior to employee identity, clock in, clock out,
  completed duration, period-based entry selection, total hours, and employee rename. It
  explicitly excludes scheduling, pay rates, wages, taxes, leave, approvals, authentication,
  authorization, notifications, multi-company tenancy, and a finished Web experience.
- Session 00.6 derives `Employee`, `ClockEntry`, `Address`, service/use-case behavior,
  repository contracts, and project responsibilities from those requirements. `Timesheet`,
  `WorkSummary`, EF Core persistence, and the incomplete Web host are labeled with the same
  original-source/course-extension/future-work distinctions used elsewhere in this file.
- Four accessible inline SVG kinds per session were added to `tools/build-site.mjs`; no PNGs,
  external images, or C# application changes were introduced.
- The manifest now contains 38 sessions in this prerequisite order: 00 → 00.5 → 00.6 →
  01–35. Validation now checks each prerequisite against the previous manifest entry rather
  than assuming every session number is an integer.

Verification: the site build generated 120 HTML pages; all 38 manifest sessions passed the
existing navigation, interaction, SVG accessibility, content-policy, and internal-reference
checks. Both new sessions were browser-reviewed against a local build. The pinned .NET SDK
10.0.302 was unavailable in the verification environment, so the unchanged C# solution was
not rebuilt during this documentation-only update.
