# Codex Prompt — Correct Session 31 from Learner Feedback

Perform a focused learner-feedback correction pass on **Session 31 — EF Core Context, Entities, and Tracking** in the C# Learn with AI course.

Use the repository's actual current state. Read these files completely before editing:

- `docs/LAB_STRUCTURE_STYLE.md`
- `docs/LEARNER_FEEDBACK.md`
- `docs/SECONDARY_TERTIARY_THOUGHTS.md`
- `site/data/sessions/session-30B.json`
- `site/data/sessions/session-31.json`
- `site/data/sessions/session-32.json`
- The learner repository's active branch and all in-progress or completed Session 31 files

Do not complete, rewrite, relocate, rename, format, or otherwise change the learner's implementation. Correct course lesson data, generated representations, authoring support, and documentation only.

## Preserve the lesson boundary

- Keep Session 31 as the first genuine asynchronous persistence boundary.
- Keep the production Domain contract and service, Infrastructure EF Core implementation, and SQLite integration test.
- Preserve the earlier synchronous in-memory repository and service.
- Keep cancellation-token forwarding at genuine I/O boundaries.
- Do not introduce Session 32 query-composition material beyond what Session 31 needs for one open-entry lookup.
- Do not introduce HTTP, controllers, Web changes, migrations, production DI registration, mocking, background work, or unrelated naming cleanup.
- Do not modify Session 32 or later implementation content.
- Keep the complete final solution behind Solution Reveal.
- Keep visible instructions paste-ready, TTS-friendly, and learner-readable.

## Primary learner-experience problem

Session 31 currently provides just enough nouns and completed shapes to make code possible, but not enough explanation to let the learner understand the C# grammar, EF Core lifecycle, ownership, and query behavior being composed. Several steps combine too many unfamiliar mechanisms at once.

Correct the lesson using layered explanation:

1. **Before the lab:** provide only a small boundary map and essential vocabulary.
2. **Immediately before unfamiliar code:** explain the minimum grammar and framework behavior required to write it deliberately.
3. **Immediately after each small framework-heavy code cluster:** add a collapsed section titled **“What you should be asking right now”**.
4. Inside that section, ask and answer two or three likely learner questions conversationally.
5. At the purpose checkpoint, reconnect the mechanics to the persistence objective with one short comprehension question.
6. Keep broader searchable terminology and tooling ideas in `docs/SECONDARY_TERTIARY_THOUGHTS.md` rather than expanding this required lab.

Do not place all deep theory before the lab. Do not postpone essential meaning until after the learner has typed unexplained code.

## Correction 1 — Treat template deletion as pre-lab cleanup

Deleting the unused Infrastructure `Class1.cs` template is repository cleanup, not an EF Core learning action.

- Move it to an unnumbered **Pre-lab cleanup** item.
- Verify the exact file exists before instructing deletion.
- Make clear that only the unused placeholder is removed.
- Do not count this cleanup toward the numbered learning-step total.

Renumber every real lab step consistently after this correction.

## Correction 2 — Explain dependencies and use readable Bash commands

Before installing anything, explain the difference between a project reference and a NuGet package reference.

Explain what each dependency contributes:

- The Domain project reference lets Infrastructure implement Domain repository contracts and map persistence entities to and from Domain objects.
- `Microsoft.EntityFrameworkCore.Sqlite` provides EF Core `DbContext` APIs, the SQLite provider, relational behavior, and async database methods used in this session.
- `Microsoft.Extensions.DependencyInjection.Abstractions` provides DI contracts and registration abstractions without installing the complete container implementation where only abstractions are needed.
- `SQLitePCLRaw.bundle_e_sqlite3` supplies the selected native SQLite bundle. Explain why the repository pins the patched version instead of presenting its package name as magic.

Use descriptive Bash variables so repeated paths and versions do not obscure the commands:

```bash
infrastructure_project="src/PinkMachine19.TimeClock.Infrastructure/PinkMachine19.TimeClock.Infrastructure.csproj"
domain_project="src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj"

dotnet_package_version="10.0.10"
sqlite_bundle_version="2.1.12"
```

Then show each command separately, quote every variable expansion, and place one short TTS-friendly explanation immediately before or after that command. Explain that these are temporary Bash variables, not C# variables or project-file syntax.

Do not repeat long full project paths in every command when meaningful variables make the operation easier to read.

## Correction 3 — Explain why the async interface belongs in Domain/Repositories

Before naming the interface path, explain:

- Domain owns the persistence-agnostic promise.
- Infrastructure fulfills that promise through EF Core.
- The existing synchronous `IClockEntryRepository` lives in `Domain/Repositories`, so `IAsyncClockEntryRepository` belongs beside it.
- This repository organizes contracts by responsibility rather than collecting every interface in a generic `Interfaces` folder.
- An `Interfaces` folder could be valid in another codebase, but introducing a second convention here would be unrelated churn.
- The learner repository uses global namespaces, so folder placement organizes source but does not automatically create a C# namespace.

Use the memory anchor:

> Domain owns the promise; Infrastructure fulfills it.

Teach the two signatures explicitly:

- Plain `Task` means asynchronous completion without a result value.
- `Task<ClockEntry?>` means asynchronous completion with either a `ClockEntry` or `null`.
- `cancellationToken = default` lets a caller omit a token while preserving forwarding when one exists.

## Correction 4 — Use warning-free incremental implementations

When `EfClockEntryRepository` first implements the interface, it should compile before EF bodies are added:

- A non-async method returning `Task` temporarily returns `Task.CompletedTask`.
- A non-async method returning `Task<ClockEntry?>` temporarily returns `Task.FromResult<ClockEntry?>(null)`.
- When the first `await` is added, instruct the learner to add `async` and remove the temporary Task return.
- In an `async Task<ClockEntry?>` method, the body returns a `ClockEntry` or `null`; the compiler manages the Task.

Never knowingly leave the learner at the end of a step with a missing return or avoidable compile error. Querying and returning the mapped result must be completed within the same numbered step if separating them would leave the method uncompilable.

## Correction 5 — Refresh object-initializer grammar

When mapping `ClockEntry` to `ClockEntryEntity`, provide a one-sentence reminder and generic shape before requiring the syntax:

```csharp
SomeType value = new()
{
    PropertyOne = source.PropertyOne,
    PropertyTwo = source.PropertyTwo
};
```

Explain that an object initializer creates the object and assigns settable properties. Contrast it briefly with separate property assignments. Make clear that `Id` is not copied from Domain because SQLite generates the row key.

## Correction 6 — Explain invariants where Domain and persistence separate

At the `ClockEntryEntity` step, remind the learner:

> An invariant is a rule that must remain true for a valid domain object.

Explain:

- Domain `ClockEntry` protects business rules through constructors and methods.
- `ClockEntryEntity` primarily represents stored columns and has setters needed for materialization.
- Mapping from persistence back to Domain should construct a valid Domain object rather than bypassing its rules.
- Public entity setters do not mean Domain should surrender its invariants.

Apply the course-wide rule selectively: refresh earlier definitions exactly where they matter again instead of assuming the vocabulary is fresh.

## Correction 7 — Explain the DbContext C# grammar and EF mechanics

The `TimeClockDbContext` step currently combines inheritance, generics, constructor forwarding, expression-bodied properties, provider configuration, and tracking without sufficient explanation.

Teach each layer before combining it:

- `TimeClockDbContext : DbContext` means the course context derives from EF Core's base context type.
- `: base(options)` is a C# constructor initializer. It invokes the base-class constructor before the derived constructor body and forwards the same options object.
- `DbContextOptions<TimeClockDbContext>` contains caller-provided EF configuration such as the provider, SQLite connection or connection string, and optional EF behavior such as logging. It does not contain employee addresses or stored rows.
- `DbSet<ClockEntryEntity>` is EF Core's query-and-save entry point for rows represented by that entity type. It is not merely a `List<T>` containing every table row in memory.
- `Set<ClockEntryEntity>()` asks this context for its managed set for that entity type.
- Tracking means the context remembers entity instances and states such as `Added`, `Unchanged`, `Modified`, and `Deleted`, allowing `SaveChanges` to determine which SQL commands to send.
- Accessing a `DbSet` does not load every row. Queries are translated and executed through the configured provider when materialized; returned or added entities may then be tracked in memory.

Include the timeline:

```text
Caller builds options
→ TimeClockDbContext receives them
→ base(options) forwards them to DbContext
→ EF Core configures the context
→ the derived constructor body runs
```

Use comprehension questions such as:

- “Who created the options?”
- “Which constructor receives them next?”
- “Has a query run merely because ClockEntries was accessed?”

## Correction 8 — Explain Add versus SaveChangesAsync

At the save step, explain:

- `ClockEntries.Add(entity)` changes EF Core's in-memory tracking state to `Added`.
- `Add` does not perform the SQL insert.
- `SaveChangesAsync(cancellationToken)` examines tracked changes and performs genuine database I/O.
- Await observes that operation; it does not automatically create another thread.
- Forwarding the token lets the database operation observe cancellation.

Use the memory anchor:

> Add tracks the change. SaveChanges sends the change.

## Correction 9 — Explain the query without claiming all rows are in memory

For the open-entry query, explain each new operation:

- `ClockEntries` begins an EF query.
- `AsNoTracking` declares read-only intent and avoids tracking the returned entity.
- The predicate filters by employee ID and `Clockout == null`.
- `FirstOrDefaultAsync` executes the translated SQLite query and produces the first entity or `null`.
- The cancellation token is forwarded to the provider operation.

Explain that EF Core translates the filter to SQL; it does not first load the whole table and then run the predicate as an in-memory list operation.

When mapping back:

- Return `null` when no row exists.
- Otherwise create a valid Domain `ClockEntry` through its constructor.
- Because the query selects only open rows, do not call `ClockOutEntry` during this mapping.
- A readable conditional expression may be shown as an optional compact equivalent after the explicit null logic is understood.

## Correction 10 — Separate pasteable framework setup from learning work

The learner should not be required to manually retype unfamiliar SQLite connection and options-builder boilerplate merely to prove persistence understanding.

In the repository test:

- Label the in-memory SQLite connection, `DbContextOptionsBuilder`, `UseSqlite`, context construction, and `EnsureCreatedAsync` as **Setup code: paste this**.
- Label the Domain entry creation, repository save, repository query, and assertions as **Learning code: write this**.
- Explain why the connection must remain open: an in-memory SQLite database exists only for the lifetime of that connection.
- Explain that `UseSqlite(connection)` selects the provider and connection.
- Explain that `EnsureCreatedAsync` creates the schema before the first save.

The test's meaningful evidence is:

```text
Domain ClockEntry
→ mapped entity
→ SQLite insert
→ SQLite query
→ mapped Domain ClockEntry
```

Do not equate manually typing boilerplate with understanding.

## Correction 11 — Keep one numbered step as one complete unit

The learner uses TTS and wants a clear signal when a numbered step is finished. Do not divide a numbered step into “Part 1 of 3” across separate required interactions.

For every numbered step:

- Announce `Step n/n` once.
- Present the complete action required for that step.
- End with an explicit **“This step is complete when…”** checklist.
- If the step is too large to present coherently as one unit, split it into additional numbered steps and update every denominator.
- Keep paragraphs and code blocks short enough for TTS.

Do not use hidden sub-parts that make the learner unsure whether the numbered step has ended.

## Correction 12 — Test discovery versus VS Code display

The completed EF test was successfully discovered and passed through `dotnet test`, but it did not immediately appear in VS Code's Testing panel.

Near final validation, add collapsed troubleshooting:

1. Run the focused test by filter.
2. Run `dotnet test "$tests_project" --list-tests` to verify assembly discovery.
3. If command-line discovery lists the test, do not rewrite valid test code merely because VS Code is stale.
4. Confirm VS Code is connected to WSL and opened at the learner repository root.
5. Run `Test: Refresh Tests`.
6. If needed, run `Developer: Reload Window` and reopen Testing.

State that command-line discovery is authoritative for the built test assembly; the Testing panel is an editor view that may require refresh.

## Purpose reminders

Add unnumbered purpose checkpoints at natural transitions:

- After dependency setup: the projects can now express the Domain contract and SQLite implementation.
- After the async interface: the promise exists, but no persistence implementation exists yet.
- After entity and context creation: the storage shape and EF session exist, but no repository maps between boundaries yet.
- After save implementation: EF tracks and persists mapped rows.
- After query implementation: the repository can retrieve and reconstruct an open Domain entry.
- Before the async service: the service coordinates business acceptance while the repository owns persistence mechanics.
- Before the integration test: the test should prove a real SQLite round trip rather than only object construction.
- Before final validation: distinguish focused repository evidence from cumulative solution health.

Purpose reminders must remain unnumbered.

## Course-wide placement rules

Preserve the learner's requested documentation split:

- Direct corrections required to understand or complete an active lab belong in `docs/LEARNER_FEEDBACK.md` and the corrected lesson.
- Broader tooling ideas, searchable terminology, terminal-navigation enhancements, optional modules, and future course infrastructure belong in `docs/SECONDARY_TERTIARY_THOUGHTS.md`.

Keep the future searchable terminology/reference idea optional. Do not use a glossary as a substitute for explaining required terms inside Session 31.

## Consistency and validation

Synchronize all affected representations:

- `site/data/sessions/session-31.json`
- Generated Session 31 lesson page
- Standalone lab page
- Quiz page if wording changes
- `docs/LEARNER_FEEDBACK.md`
- `docs/LAB_STRUCTURE_STYLE.md` only for genuinely course-wide rules
- Generator or validator support only when genuinely necessary

Validate:

1. Pre-lab cleanup is unnumbered.
2. Every numbered step and denominator agrees after restructuring.
3. Every step ends with a clear completion condition.
4. No numbered step is divided into hidden required sub-parts.
5. Dependencies use readable Bash variables and adjacent explanations.
6. Contract ownership and folder convention are explained before file creation.
7. Temporary implementations compile without avoidable warnings or missing returns.
8. Object initializer, invariants, base constructor, options, DbSet, tracking, and materialization are explained just in time.
9. “What you should be asking right now” appears as useful collapsed sections rather than decorative repetition.
10. Setup code and learning code are clearly distinguished in the test.
11. Complete implementations remain behind Solution Reveal.
12. Visible C# instructions remain paste-ready comments when they are not explicitly labeled setup code.
13. The focused EF repository test passes.
14. The Release solution builds.
15. The complete test suite passes with `--no-build`.
16. Session 31 Notes, Bookmark, and Shortcuts controls initialize.
17. The complete site regenerates and validates.
18. Learner code and unrelated production code remain unchanged.

Do not push unless explicitly requested.

## Final report

Report:

- Exact lesson corrections
- Exact files changed
- Final numbered step count and purpose-checkpoint count
- Pre-lab cleanup treatment
- Dependency explanations and Bash command format
- Domain contract ownership explanation
- Warning-free Task progression
- DbContext grammar and EF lifecycle explanations
- Save and query mental models
- Setup code versus learning code split
- TTS step-completion design
- Test discovery troubleshooting
- Focused test, build, and complete-suite results
- Site generation, validation, and widget results
- Confirmation that learner code was unchanged
