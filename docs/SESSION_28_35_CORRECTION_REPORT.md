# Sessions 28–35 Correction Report

## Session 28

- Original inaccuracies: fictional async production repository, `Clockout`, `GetClockEntry`, `CancellationToken`, CS4014, missing await, and a `CalculateTotalHours` race.
- Design decision: permanent ScratchPad experiment showing that awaiting a Task observes completion and exceptions.
- Files changed: Session 28 lesson/build metadata, ScratchPad `Session28/AsyncFailureExperiments.cs`, and ScratchPad `Program.cs`.
- New learner artifact: `src/PinkMachine19.TimeClock.ScratchPad/Session28/AsyncFailureExperiments.cs`.
- Production state: unchanged and synchronous.
- Build result: Release build passed with 0 warnings and 0 errors.
- Test result: full suite passed, 8 of 8.
- Safe next assumption: a learner can store a Task, await it inside `try`, and catch its exception.
- Remaining concern: background-service ownership and cancellation remain optional/later topics.

## Session 29

- Original inaccuracies: examples referenced nonexistent `CalculateTotalHoursAsync` and a different mocked service shape.
- Design decision: permanent synchronous AAA tests against the learner's actual `PayrollService.CalculateTotalHours` and in-memory repository.
- Files changed: Session 29 lesson/build metadata and learner `PayrollServiceTests.cs`.
- New learner artifact: `tests/PinkMachine19.TimeClock.Domain.Tests/PayrollServiceTests.cs`.
- Production state: unchanged and synchronous.
- Build result: Release build passed with 0 warnings and 0 errors.
- Test result: focused PayrollService tests passed, 2 of 2; full suite passed, 8 of 8.
- Safe next assumption: completed totals and the zero-entry boundary have permanent tests.
- Remaining concern: existing spelling/casing inconsistencies remain deliberately unchanged.

## Session 30

- Original inaccuracies: assumed earlier DI registrations, Moq, nonexistent methods, and an already-established lifetime policy.
- Design decision: introduce the container itself in ScratchPad with three marker types and observable transient, scoped, and singleton identity.
- Files changed: Session 30 lesson/build metadata, ScratchPad project/package, `Session30/LifetimeExperiments.cs`, and ScratchPad `Program.cs`.
- New learner artifact: `src/PinkMachine19.TimeClock.ScratchPad/Session30/LifetimeExperiments.cs`.
- Production state: unchanged; no production container registration yet.
- Build result: ScratchPad ran and the Release solution built.
- Test result: full suite passed.
- Safe next assumption: the learner has explicitly observed all three DI lifetimes and knows what a composition root chooses.
- Remaining concern: shared mutable lifetime edge cases remain optional.

## Session 31

- Original inaccuracies: treated EF as if it implemented the existing synchronous contract and did not clearly introduce the first genuine I/O boundary.
- Design decision: preserve the synchronous repository and add a separate `IAsyncClockEntryRepository`, `AsyncClockEntryService`, EF Core context/entity, and SQLite implementation.
- Files changed: Domain async contract/service, Infrastructure project and EF files, test project reference, Session 31 lesson/build metadata, and solution project list.
- New learner artifacts: `IAsyncClockEntryRepository`, `AsyncClockEntryService`, `ClockEntryEntity`, `TimeClockDbContext`, `EfClockEntryRepository`, and its SQLite test.
- Production state: synchronous in-memory flow remains available; genuine async SQLite clock-in is now available separately.
- Build result: Release build passed with 0 warnings and 0 errors using EF Core 10.0.10 and patched SQLitePCLRaw 2.1.12.
- Test result: focused persistence test and full suite passed.
- Safe next assumption: async suffixes and cancellation parameters belong to verified EF Core I/O.
- Remaining concern: migrations are intentionally deferred; the learning host uses `EnsureCreated`.

## Session 32

- Original inaccuracies: claimed production async existed in Sessions 26–28 and blurred `IEnumerable` with provider-backed `IQueryable`.
- Design decision: add one query builder returning `IQueryable<ClockEntryEntity>` and one `ToListAsync` materialization boundary.
- Files changed: `ClockEntryDataQueries.cs`, its SQLite test, and Session 32 lesson/build metadata.
- New learner artifacts: `ClockEntryDataQueries` and `ClockEntryDataQueriesTests`.
- Production state: EF can translate completed-entry filters and execute them asynchronously.
- Build result: Release build passed with 0 warnings and 0 errors.
- Test result: provider-executed filtering test and full suite passed.
- Safe next assumption: query construction is deferred; `ToListAsync` performs database execution and does not imply a background thread.
- Remaining concern: provider-difference examples remain optional.

## Session 33

- Original inaccuracies: assumed controllers, DTOs, routes, services, and Web wiring already existed.
- Design decision: explicitly create the first learner Web host, request/response records, controller, route, and result translation over `AsyncClockEntryService`.
- Files changed: new Web project and solution entry, Web contracts/controller/Program, controller test, test project reference, and Session 33 lesson/build metadata.
- New learner artifacts: `PinkMachine19.TimeClock.Web`, `ClockInRequest`, `ClockEntryResponse`, and `ClockEntriesController`.
- Production state: `POST /clock-entries/clock-in` returns BadRequest, Conflict, or Created and forwards request cancellation to SQLite I/O.
- Build result: Web started successfully on a local test URL; Release build passed.
- Test result: invalid input test proves rejection occurs before persistence; full suite passed.
- Safe next assumption: the first HTTP boundary and its DTOs now genuinely exist.
- Remaining concern: authentication and broader HTTP integration hosting are later topics.

## Session 34A

- Original inaccuracies: described a fictional missing registration and types that did not exist in the learner solution.
- Design decision: extract the actual DbContext/repository/service registrations into `AddTimeClockPersistence` and verify scoped constructor resolution.
- Files changed: Infrastructure `ServiceRegistration.cs`, Web `Program.cs`, registration test, and Session 34A lesson/build metadata.
- New learner artifacts: `ServiceRegistration.AddTimeClockPersistence` and `ServiceRegistrationTests`.
- Production state: Web is the composition root and persistence dependencies are scoped per request.
- Build result: Web startup and Release build passed with no resolution failure.
- Test result: real container resolution test and full suite passed.
- Safe next assumption: `AsyncClockEntryService` resolves transitively with its EF repository and DbContext.
- Remaining concern: alternative lifetime edge cases remain optional.

## Session 34B

- Design decision: preserve validation, logging, and API error responses as their own production HTTP-boundary lesson.
- Files changed: Web `ClockEntriesController.cs` and Session 34B lesson/build metadata.
- Production state: invalid input, conflict, and unexpected failure map to deliberate ProblemDetails while structured logs retain safe diagnostic context.
- Safe next assumption: the clock-in endpoint has explicit client-facing errors without leaking exception details.

## Session 35

- Original inaccuracies: depended on invented earlier races, missing awaits, completion workflow types, and registration bugs.
- Design decision: use the natural duplicate-open-clock-in rule as a focused SQLite integration milestone.
- Files changed: `ClockEntryWorkflowTests.cs` and Session 35 lesson/build metadata.
- New learner artifact: `ClockEntryWorkflowTests`.
- Production state: the async service persists one open entry and rejects a duplicate without inserting another row.
- Build result: App and ScratchPad ran, Web started, and the Release solution built with 0 warnings and 0 errors.
- Test result: workflow test passed; full suite passed, 13 of 13.
- Safe next assumption: Sessions 26–35 form a verified path from Task concepts to DI, genuine async SQLite I/O, IQueryable execution, HTTP translation, and integration verification.
- Remaining concern: clock-out persistence, migrations, and advanced cancellation composition are future work rather than hidden prerequisites.

## Final stale-reference classification

- Valid current references: learner `ClockEntry.Clockout` and `ClockEntryEntity.Clockout` preserve the learner's verified member spelling; Session 31–32 references to that property are therefore current.
- Valid negative checks: corrected Sessions 27–29 name `EntryBatchLoader`, `CalculateTotalHoursAsync`, `CS4014`, missing-await, and fictional method names only to state that the primary labs do not introduce them.
- Optional supporting material: deterministic concurrency gates and `TaskCompletionSource` remain mentioned only as optional advanced concepts, not prerequisites.
- Stale course-authoring references outside the corrected Session 26–35 learner path: `APPLICATION_PROGRESSION.md`, `SOURCE_MAPPING.md`, `REBUILD_STATUS.md`, the old cumulative authoring Domain/App source, and a Session 49 SVG still describe the pre-correction sample history. They were not deleted or broadly rewritten because this task forbids unrelated cleanup; none is used by the corrected Session 26–35 generated lessons or learner solution.
- Stale early-session wording: some Sessions 08, 10, 11, 16, and 17 still reflect the original course-authoring API names. Those sessions predate the requested correction range and require a separate audit against the learner's earlier history.
