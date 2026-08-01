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
session content.

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
comment rather than silently fixed.

| Real source file | Destination file | Preserved real quirks |
|---|---|---|
| `Models/ClockEntry.cs` | `src/TimeClock.Domain/ClockEntry.cs` | `GetDuartion()` (typo), "Employee has not clcoked out yet" (typo), "Employee can only clock out once", private `ClockOut` setter, no constructor validation |
| `Models/Employee.cs` | `src/TimeClock.Domain/Employee.cs` | mutable `Name`/`Address`, no constructor validation, `DisplayName()` writes to Console, `Rename(newName)` |
| `Models/Address.cs` | `src/TimeClock.Domain/Address.cs` | `Street`/`City` default to `""`, verbatim |
| `Dtos/EmployeeDto.cs` | `src/TimeClock.Domain/EmployeeDto.cs` | real CS8618 nullable-warning shape (no default, no constructor); this course's `TreatWarningsAsErrors` (not present in the real repo) required a documented local pragma suppression — see the file's own comment |
| `Interfaces/IClockEntryRepository.cs` | `src/TimeClock.Domain/IClockEntryRepository.cs` | the only `CancellationToken` in the codebase, unused/decorative |
| `Interfaces/IClockEntryService.cs` | `src/TimeClock.Domain/IClockEntryService.cs` | `ClockIn` sync, `Clockout` (lowercase o) async — casing mismatch preserved |
| `Interfaces/IEmployeeRepository.cs` | `src/TimeClock.Domain/IEmployeeRepository.cs` | verbatim |
| `Interfaces/IEmployeeServices.cs` (file plural, interface singular) | `src/TimeClock.Domain/IEmployeeService.cs` | interface name kept singular per real code; the file-name/type-name mismatch itself is called out in a comment rather than reproduced as a literal filename, since GitHub Pages content has no notion of a source filename separate from the type |
| `Repositories/ClockEntryRepository.cs` | `src/TimeClock.Domain/ClockEntryRepository.cs` | public mutable `_clockEntries` field, fake-async `GetClockEntry` (`Task.FromResult` over sync work), leftover debug `for` loop printing 0-9, empty `foreach` |
| `Repositories/EmployeeRepository.cs` (class `EmployeeRepositor`, typo) | `src/TimeClock.Domain/EmployeeRepositor.cs` | class-name typo preserved, hardcoded stub ignoring its `employeeId` argument |
| `Services/ClockEntryService.cs` | `src/TimeClock.Domain/ClockEntryService.cs` | real, correct `async`/`await` `Clockout` implementation |
| `Services/EmployeeService.cs` | `src/TimeClock.Domain/EmployeeService.cs` | verbatim |
| `Services/PayRollService.cs` (file/class casing mismatch) | `src/TimeClock.Domain/TimeClockService.cs` (class `PayrollService`) | dead `IEmployeeService` dependency, `.Sum(x => x.GetDuartion().TotalHours)` one-liner |
| `Program.cs` (console app) | `src/TimeClock.App/Program.cs` | mixed Transient/Singleton DI lifetimes, unawaited `clockEntryService.Clockout(1)` (real CS4014, locally pragma-suppressed and documented rather than silently fixed) |
| `tests/.../PayrollServiceTest.cs` | `tests/TimeClock.Domain.Tests/PayrollServiceTests.cs` | verbatim Moq-based test, including the unconfigured `Mock<IEmployeeService>` |

**Deviations from byte-for-byte fidelity, and why:**
- `Console.ReadLine()` was dropped from the end of `Program.cs` — it would hang any
  non-interactive `dotnet run` in CI/build verification. Documented in the file's own
  comment.
- Real property/parameter names use `DateTime`, not `DateTimeOffset`; this matches the
  real source exactly (`DateTime.Now`, `DateTime ClockIn`, etc.) — no deviation here, this
  row exists only because the prior TimeLedger rebuild used `DateTimeOffset` throughout
  and that had to be corrected.

## Real code -> new, clearly-labeled extensions

Per the task brief, EF Core, working REST endpoints, and a filled-in `IEmployeeService`
Web API registration do not exist anywhere in the real source. These destination files are
new, but are built directly on the real domain and its real, documented gaps:

| Destination file | Real gap it extends |
|---|---|
| `src/TimeClock.Infrastructure/TimeClockDbContext.cs` (`PayrollDbContext`, `ClockEntryEntity`) | The real repo has no EF Core anywhere. This is "give `ClockEntryRepository` a real EF Core-backed implementation behind the same domain shape" — the exact framing the task brief calls for. |
| `src/TimeClock.Infrastructure/ClockEntryWorkflow.cs`, `ClockEntryDataQueries.cs` | Compose the real `EntryCompletion` validation with the new EF Core layer; no real equivalent exists. |
| `src/TimeClock.Web/*` | `Parm.Practice.WebApi/Program.cs` calls `AddControllers()`/`MapControllers()` against **zero** controller classes, and never registers `IEmployeeService`/`EmployeeService` — so resolving `PayrollService` from that host would throw at runtime. `TimeClock.Web` is the "write the missing controller the real WebApi has been waiting for" extension the task brief explicitly asks for. **Status: mechanically renamed and compiling, but still built on minimal APIs (`MapPost`) rather than the controller-based `AddControllers()`/`MapControllers()` shape the real WebApi actually uses, and does not yet reproduce the real missing-`IEmployeeService`-registration bug as a lab. This is flagged as unfinished — see "Known gaps" below.** |
| `src/TimeClock.Domain/EmployeeDirectory.cs`, `Timesheet.cs`, `ClockEntryAnalytics.cs`, and other small collection/generics/variance/async teaching files | Not present in the real repo at all (it has no generics beyond framework built-ins, no variance, no records). These are clearly-new, small, single-purpose teaching examples that reuse the real `Employee`/`ClockEntry`/`Address` shapes (int `EmployeeId`, `DateTime` `ClockIn`/`ClockOut`, mutable `Employee.Name`) rather than inventing a second, parallel type system the way the TimeLedger rebuild's `Worker`/`TimeEntry` types did. |

## Syllabus steps -> sessions

| Syllabus source | Sessions | Fidelity |
|---|---|---|
| Steps 1-39 (empty narrative, titles + one generic snippet only) | 1-4, 7-18 | Titles/sequence used as hints only, per the task brief's own instruction ("all prose and examples must be written fresh"). Currently carry the **mechanical rename only** (see "Honest per-session status" below) — not yet re-grounded session by session the way 5, 6, 19-23, 25, 28, 34 were. |
| Steps 40-41 (early, now-superseded scaffolding) | Referenced in Session 5's history but not reused as authoritative | Used only as historical staging reference, per the task brief. |
| **Step 42 (Clock In) — HIGH FIDELITY** | **Session 5** | Reused near-verbatim: the 6 real substeps (constructor review -> interface -> `DateTime.Now` implementation -> save -> DI registration -> resolve/run/verify) became Session 5's lab steps directly. |
| **Step 43 (Clock Out) — HIGH FIDELITY** | **Session 6** (nullable `GetClockEntry` contract) | The real correction-trail (`Clockout` not `ClockOut`, `async Task` not `void`) is preserved in Session 6 and 19's prose as "confirmed in real code" style commentary. |
| **Step 44 (Duration & Payroll) — HIGH FIDELITY** | **Sessions 19, 20** | decision-0006 (dead `IEmployeeService` dependency) grounds Session 19; the real `.Sum(x => x.GetDuartion().TotalHours)` one-liner grounds Session 20. The real xUnit/Moq test grounds Session 28. |
| **Step 45 (LINQ Basics) — HIGH FIDELITY** | **Sessions 20, 21, 22** | decision-0007's "plan vs. delivered reality" narrative (three planned stages -> two delivered methods) is Session 20's central concept. |
| **Step 46 (Error Handling) — good prose, UNEXECUTED code** | **Session 23** | Reused the prose (throw-vs-return rule) but explicitly labeled the "name the employee in the message" proposal as this session's **lab**, not as delivered fact — per the task brief's explicit instruction for this step. |
| Steps 47-68, 73-80 (well-written but 100% unverified/unexecuted) | Sessions 24-33 (directional only) | Used as topic/order guidance only; all actual lesson content in the sessions that were deep-rewritten (25, 28) was built fresh against real code plus clearly-labeled new material, not lifted from this unexecuted prose. Sessions 24, 26, 27, 29-33 have **not yet** received this treatment — see "Honest per-session status." |
| Step 49 (Intro to ASP.NET Core) — stale, assumes WebApi doesn't exist | Session 32 (not yet rewritten) | Needs correction when rewritten: the WebApi project **does** exist, broken, exactly as the task brief describes. |
| Steps 57-61 (SQL/EF Core, assume a `PayrollDbContext` that doesn't exist) | Sessions 30-31 (not yet rewritten) | Directional only; the actual `PayrollDbContext` built in this rebuild (see extensions table above) is new and should be described as new when these sessions are rewritten. |
| Steps 69-72 (interview-prep filler, company-specific) | **Omitted entirely**, per explicit task instruction | Not present anywhere in the new course. |
| `decisions.json` (7 entries) | Sessions 19, 20, 23 | decision-0004 (real save method is `SaveClockEntry`, not `Save`), decision-0005 (mixed DI lifetimes), decision-0006 (dead `IEmployeeService` dependency), decision-0007 (LINQ one-liner) all appear as named, cited content in the relevant sessions rather than generic "governing rule" prose. |

## Honest per-session status

**Deep-rewritten, grounded directly in real code/real syllabus steps/decisions.json**
(verified against source files, not assumed):
- Session 5 — Classes/Constructors (real `ClockEntry`/`Employee`, Step 42)
- Session 6 — Nullability/Invariants (real `ClockOut`/`EmployeeDto`, Step 43)
- Session 19 — Dependency Injection (real `PayrollService` ctor, decisions 0005/0006)
- Session 20 — LINQ Pipelines (real `CalculateTotalHours`, decision 0007)
- Session 21 — Grouping/Joining (extension built on the real Sum projection)
- Session 22 — Deferred Execution (real `GetEmployeeClockEntries` return type)
- Session 23 — Validation/Exceptions (real throw-vs-return pattern, Step 46)
- Session 25 — Tasks/Async (real `Clockout`/`GetClockEntry`, real CS4014 bug identified)
- Session 28 — Unit Tests (real `PayrollServiceTests.cs` traced in full)
- Session 34 — Integration capstone (already well-grounded pre-existing content; added
  the CS4014 fix as an explicit lab step, corrected a stale "64 tests" claim)
- Session 1 — was already well-grounded pre-existing content (real `dotnet build`/`test`/`run`
  loop against the real solution); only needed the mechanical rename.

**Mechanically renamed only** (TimeLedger -> TimeClock, `Worker` -> `Employee`,
`TimeEntry` -> `ClockEntry`, `DateTimeOffset` -> `DateTime`, etc. — technically consistent,
compiles/validates, uses real domain vocabulary throughout, but the session's specific
prose/lab was **not** re-derived from a specific real syllabus step or decision record.
Most of these map to syllabus steps 1-39, which the task brief itself documents as having
**no real narrative content to draw from** — empty `goal`/`why`/`mentalModel` fields, titles
only):
- Sessions 2, 3, 4 (variables, control flow, methods — no real syllabus prose exists for
  these; content is generic-but-correct C# fundamentals using the real domain's vocabulary)
- Sessions 7, 8, 9 (value/reference semantics, ref/out/in, records/structs/equality — same)
- Sessions 10, 11, 12, 13, 14, 15 (collections, generics, variance — same; Session 12 could
  be strengthened further by explicitly tying to Step 44's `IEnumerable<ClockEntry>` return
  type, which has not yet been done)
- Sessions 16, 17, 18 (encapsulation, interfaces, abstract classes/inheritance — these
  **do** have real grounding available, in `IClockEntryRepository`/`ClockEntryRepository`
  and `IEmployeeService`/`EmployeeService`, that has not yet been used to replace the
  "governing rule" template language still present in these three files)
- Session 24 (exception propagation/`IDisposable`/`using` — `IDisposable` has no real
  source counterpart at all in `practice-07092026`; needs a clearly-labeled-new treatment)
- Sessions 26, 27 (concurrent async flow, cancellation — Session 27 in particular should
  be the session that actually fixes Program.cs's real CS4014 bug and discusses why the
  pre-fix total-hours output is near-zero "by accident"; this has not yet been moved from
  Session 34 into Session 27 where the task brief's structure would suggest it belongs)
- Sessions 29 (test doubles/DI lifetimes — natural next step after Session 28's real test;
  not yet rewritten)
- Sessions 30, 31 (EF Core — new extension per the table above; session prose still uses
  "governing rule" template language and has not been rewritten to explain *why* EF Core
  is new, using the real repo's total absence of a data layer as the explicit hook)
- Sessions 32, 33 (ASP.NET Core/WebApi — new extension; session prose still uses template
  language and has not yet been rewritten to walk through the real `Parm.Practice.WebApi`
  `Program.cs`'s two real bugs: `MapControllers()` with zero controllers, and the missing
  `IEmployeeService` registration that would make `PayrollService` resolution throw)

All 34 sessions, including the mechanically-renamed ones, pass the site's own validator
(manifest schema, unique IDs, prerequisites, required sections, accessible SVGs, internal
links, navigation) — see REBUILD_STATUS.md for the exact command and output. "Mechanically
renamed" describes narrative depth, not technical correctness or domain consistency: no
session references TimeLedger, Worker, TimeEntry, DateTimeOffset, or any other fictional
artifact anywhere in the site.

## Known gaps (not completed in this pass)

1. **TimeClock.Web is not yet controller-based.** It should be rewritten to mirror
   `Parm.Practice.WebApi/Program.cs`'s real `AddControllers()`/`MapControllers()` shape,
   with a `ClockEntriesController` as the "missing controller" lab, and should reproduce
   the real missing-`IEmployeeService`-registration bug as an explicit lab (resolve
   `PayrollService` from the host and watch it throw, then fix the registration).
2. **Sessions 2-4, 7-18 (minus none), 24, 26, 27, 29-33** need the same treatment given to
   5, 6, 19-23, 25, 28, 34: replace "The governing rule is..." template language with
   content grounded in specific real files, real decisions, or (for 30-33) an explicit,
   honest "this is new, and here is the real gap it fills" framing.
3. **Session 27** should be the session that actually applies the CS4014 fix (currently
   done in Session 34 instead), matching the task brief's suggested placement more closely.
4. **Session count/order** was kept at the prior rebuild's 34-session, 9-layer structure
   (see `site/data/course-manifest.json`) because that structure's *topic ordering* is
   sound and dependency-correct; only its *content* was fictional. No sessions were merged,
   split, added, or removed in this pass. A future pass could reasonably merge some of the
   thin steps-1-39-derived sessions once real content exists to justify the current count.

See `REBUILD_STATUS.md` for exact validation commands and their real, current output.
