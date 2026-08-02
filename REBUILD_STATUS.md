# Rebuild Status

This file reflects the real, independently re-verified state as of the final commit in this
rebuild pass. Nothing below is asserted without having actually run the referenced command
in this session and reading its real output.

## Fourth post-rebuild update: PinkMachine19 company-prefix convention (current)

Every project, `.csproj`, the `.sln`, and every namespace/`using` directive was renamed
with the `PinkMachine19.` prefix (`TimeClock.sln` -> `PinkMachine19.TimeClock.sln`,
`TimeClock.Domain` -> `PinkMachine19.TimeClock.Domain`, and so on for `App`,
`Infrastructure`, `Web`, and `Domain.Tests`), and all 36 session JSON files were updated to
match, including re-running and re-pasting the real `dotnet new sln`/`dotnet sln add`/
`dotnet build`/`dotnet sln list` output referenced in Sessions 01-02. See
`SOURCE_MAPPING.md`'s "PinkMachine19 company-prefix convention" section for full detail,
including the discovery that `dotnet new sln` now defaults to `.slnx` on the pinned SDK and
needs an explicit `-f sln` flag to match this repository's actual solution format.
Re-verified: `dotnet build PinkMachine19.TimeClock.sln -c Release` (0 warnings, 0 errors),
`dotnet test PinkMachine19.TimeClock.sln -c Release --no-build` (56/56 tests passing), and
`npm run build && npm run validate` (`Validated 114 HTML pages and 36 manifest sessions`).

## Third post-rebuild update: numbering correction (current, 36-session, contiguous 0–35 state)

The Session 00 addition below initially retired session number 1, producing 0, then 2–36.
On review that gap was reverted: it looked like a bug on a public site, and was unnecessary
in the first place, since 0 fits before 1 without shifting anything. Sessions 01–35 were
restored verbatim from the pre-Session-00 commit, the stray `session-36.json` was removed,
and `course-manifest.json`/`tools/validate-site.mjs` now expect plain contiguous 0–35
numbering with `prerequisite = number − 1` throughout (Session 1's prerequisite is `0`, no
special case). Re-verified: `npm run build && npm run validate` (`Validated 114 HTML pages
and 36 manifest sessions`), `dotnet build`/`dotnet test` unchanged (0 warnings, 56/56 tests),
and browser-checked Session 01's navigation (`← Session 00` / `Session 02 →`) and the
syllabus table's prerequisite column for sessions 00–02. See `SOURCE_MAPPING.md`'s "Session
00 addition" section, "Correction (post-review)" paragraph, for full detail.

## Second post-rebuild update: Session 00 addition (superseded numbering — see above)

A new opening chapter, Session 00 ("Why Learn C# in 2026?"), was added ahead of what was
Session 01. It is original orientation material — motivating why C# is worth learning
alongside Python/JavaScript/TypeScript, before any code is written — and is **not** derived
from `practice-07092026` or `csharp-refresher`; see `SOURCE_MAPPING.md`'s "Session 00
addition" section for full detail. (This section's numbering claims — "0, then 2 through 36"
— were the intermediate state corrected above; kept for history.)

`course-manifest.json` gained a tenth curriculum layer ("Orientation and Context", session 00
only) ahead of the existing nine, each of which had its session range shifted to match.
`npm run build && npm run validate` were verified against the (then) 36-session structure
(`Validated 114 HTML pages and 36 manifest sessions`), and `dotnet build`/`dotnet test` were
re-verified unchanged (0 warnings, 0 errors, 56/56 tests passing) since this change adds no
C# code. Session 00 was also browser-verified directly: all 11 lesson sections render, its 4
new accessible inline SVGs pass the same `role="img"`/`title`/`desc` contract as every other
diagram, and quiz/reveal interactions work.

**Everything from this point down was written before the Session 00 addition and still uses
the pre-Session-00 numbering (35 sessions, 9 layers, sessions 01–35)** — left as originally
written, consistent with how this file already preserves the pre-01/02-split numbering below.
For current, authoritative numbering, see `site/data/course-manifest.json`.

## Post-rebuild update: Session 01/02 split (35-session state at the time this section was written)

After the rebuild pass this file otherwise documents, original Session 1 was split into a
narrowed Session 01 (scaffolding + standard project-folder organization) and a new
Session 02 (project references and dependency direction, expanded with real dependency-graph
and layering content). Every session after it shifted up by one. **The course is now 35
sessions, not 34.** `site/data/course-manifest.json`'s `sessionCount` and `layers` ranges,
and every `site/data/sessions/*.json` file's `number` field and in-prose `"Session N"`
cross-references, were updated to match. See `SOURCE_MAPPING.md`'s "Session 01/02 split"
section for full detail on what moved and what's new.

**Everything below this point was written during the original rebuild pass and uses the
pre-split numbering that was current at that time** (e.g. "Session 27" below means what is
now Session 28; "Session 34" below means what is now Session 35). It was left as originally
written rather than retroactively renumbered — treat it as a historical record of that pass,
not as a live reference for current session numbers. `dotnet build`/`dotnet test` were
re-verified after the split (0 warnings, 0 errors, 56/56 tests passing, unchanged from
below) and `npm test` was re-verified against the new 35-session structure.

- **Source repositories (read-only):** `C:\Users\azureuser\repos\practice-07092026` (real
  application code), `C:\Users\azureuser\repos\csharp-refresher` (real curriculum intent —
  `course-dashboard/data/syllabus.json`, `decisions.json`, `concepts.json`)
- **Destination repository:** `C:\Users\azureuser\repos\csharp-learn-with-ai`
- **Current destination branch:** `main` (not pushed to remote — left for the user to review)
- **Current phase:** All 34 sessions deep-rewritten and re-validated against real,
  verified source code, real syllabus/decision content, or explicitly-labeled new
  extensions of the real domain. `TimeClock.Web` was rebuilt to match the real, broken
  WebApi scaffold's controller-based shape. The CS4014 fix now lives in the async session
  (27) where it belongs, not tacked onto the final integration session. Zero template/
  placeholder language remains in any of the 34 session files (verified by exhaustive grep).

## What was actually done, and how it was verified

1. **.NET solution rebuilt on the real domain.** `TimeLedger.sln` -> `TimeClock.sln`;
   `TimeLedger.Domain`/`.App`/`.Infrastructure`/`.Web` -> `TimeClock.*`. `ClockEntry`,
   `Employee`, `Address`, `EmployeeDto`, `IClockEntryRepository`, `IClockEntryService`,
   `IEmployeeRepository`, `IEmployeeService`, `ClockEntryRepository`, `EmployeeRepositor`,
   `ClockEntryService`, `EmployeeService`, and `PayrollService` are byte-faithful ports of
   the real files in `practice-07092026`, including real bugs/typos kept intentionally.
   ~20 supporting teaching-example files and their tests compile against the real
   `int EmployeeId`/`DateTime ClockIn`/`ClockOut` shape. A real xUnit+Moq
   `PayrollServiceTests.cs` mirrors the real repo's one test verbatim.
2. **`TimeClock.Web` rebuilt a second time**, replacing an initial, incorrect minimal-API
   design with a byte-faithful port of the real, broken `Parm.Practice.WebApi/Program.cs`:
   `AddControllers()`/`MapControllers()` against zero controllers, and no `IEmployeeService`
   registration (so resolving `PayrollService` throws). `WebApiRegistrationTests.cs` proves
   both the failure and its one-line fix without needing a running ASP.NET host. See
   `SOURCE_MAPPING.md`'s "The `TimeClock.Web` decision" section for the explicit rationale.
3. **All 34 sessions deep-rewritten**, grounded in one of: real, directly-read source code;
   real syllabus.json steps 42-46 and decisions.json entries; or explicitly-labeled new
   extensions with a stated, specific real-gap justification. See `SOURCE_MAPPING.md` for
   the complete per-session mapping. Highlights:
   - Sessions 5, 6: real `ClockEntry`/`Employee` constructors and nullable contracts,
     built from syllabus Steps 42-43 near-verbatim.
   - Sessions 16-18: fixed (in the lab) `ClockEntryRepository`'s real public-field
     encapsulation gap; traced all four real interface/implementation pairs including
     `EmployeeRepositor`'s real typo; added `HoursPolicyBase` as a new, honestly-labeled
     abstract-class example, since the real source has no inheritance at all.
   - Sessions 19-22: `PayrollService`'s real dead `IEmployeeService` dependency
     (decision-0006) and mixed DI lifetimes (decision-0005); the real
     `.Sum(x => x.GetDuartion().TotalHours)` one-liner (decision-0007) and its
     grouping/joining/deferred-execution extensions.
   - Sessions 23-24: the real throw-vs-return pattern already implicit in
     `GetClockEntry`/`ClockOutEmployee`; the real, unhandled `GetDuartion` exception
     path traced through `PayrollService` and `Program.cs`.
   - Sessions 25-27: the real, correct `Clockout` await and the real fake-async
     `GetClockEntry`; a new `EntryBatchLoader` extension for sequential/concurrent flow;
     **Session 27 now fixes the real CS4014 bug** (moved here from Session 34 per review
     feedback) and studies the real, unused `CancellationToken` parameter.
   - Sessions 28-29: the real `PayrollServiceTests.cs` traced fully; the real, hand-written
     `RecordingRepository` test doubles contrasted with Moq; decision-0005's real lifetimes.
   - Sessions 30-31: `PayrollDbContext`/`ClockEntryEntity` as a new extension filling the
     real "no persistence anywhere" gap; `ClockEntryDataQueries`'s real
     `IQueryable`-vs-`IEnumerable` provider-translated execution.
   - Sessions 32-33: grounded in the rebuilt, real, controller-less `TimeClock.Web` —
     Session 32's lab writes the first real controller; Session 33 reproduces and fixes
     the real missing-`IEmployeeService`-registration bug.
   - Session 34: integration capstone; CS4014-fix content removed (now owned by Session
     27) and replaced with a confirmation step that both prior real-bug fixes are in place.

## Independently re-verified evidence (commands actually run this session)

- `dotnet build TimeClock.sln --configuration Release` -> `Build succeeded. 0 Warning(s)
  0 Error(s)` (run repeatedly throughout this pass, most recently after the final session
  content commit — same clean result every time).
- `dotnet test TimeClock.sln --configuration Release --no-build` -> `Passed! - Failed: 0,
  Passed: 56, Skipped: 0, Total: 56` (also re-run after the final commit, same result).
  Test count moved from 57 to 56 when `TimeClock.Web` was rebuilt: 3 minimal-API tests
  (`ClockEntryEndpointTests.cs`, `ClockEntryRequestTests.cs`) were removed and 2 new
  `WebApiRegistrationTests.cs` tests were added.
- `dotnet run --project src/TimeClock.App/TimeClock.App.csproj --configuration Release`
  reproduces the real app's actual behavior: the leftover debug loop prints `0` through `9`,
  and (before Session 27's fix is applied) the final line is a near-zero
  `Total hours worked:` value — the real, documented consequence of the real unawaited
  `Clockout` call.
- `npm test` (runs `npm run build && npm run validate`) -> `Built 34-session course
  foundation ... Base path: /csharp-learn-with-ai/` followed by `Validated 108 HTML pages
  and 34 manifest sessions. Base path verified: /csharp-learn-with-ai/. Navigation,
  interactions, SVG accessibility, content policy, and internal references passed.`
- `grep` for template/placeholder phrases ("The governing rule is...", "This session
  establishes...", "Start by identifying...", "Follow the boundary...", "Provide the
  canonical X example", and related variants) across all 34
  `site/data/sessions/session-*.json` files -> **zero matches**.
- `grep` for fictional-domain residue (`TimeLedger`, `Worker`, `TimeEntry`, `DateTimeOffset`,
  `IsOpen`, `TeamName`) across all 34 session files -> **zero matches**.

## What was not done — explicit, not glossed over

- **`TimeClock.Web`'s controller and DI-registration fix are taught as labs**, not
  pre-applied to the shipped code — by design, consistent with every other real bug in
  this repository (Session 16's encapsulation fix, Session 27's CS4014 fix). The
  repository as checked in always represents the state *before* each session's own fix; a
  learner following the course applies every fix themselves.
- **No end-to-end GitHub Pages deployment check** was performed (no push was made; the task
  explicitly says not to push).
- **Session count/order unchanged** from the prior rebuild's 34-session structure — the
  topic ordering was judged sound; only content was rewritten. See `SOURCE_MAPPING.md`'s
  closing section for the reasoning.

## Commits made this session (on `main`, not pushed)

1. `Rebuild .NET solution on the real Employee/ClockEntry/PayrollService domain`
2. `Reground high-fidelity sessions in the real Employee/ClockEntry domain` (Sessions 5, 6,
   19-23, 25, 28, 34 — first pass)
3. `Add SOURCE_MAPPING.md and rewrite status docs with honest, verified state`
4. `Rebuild TimeClock.Web as the real, controller-less broken WebApi scaffold`
5. `Deep-rewrite sessions 7-15 (memory/type behavior, collections, generics)`
6. `Deep-rewrite sessions 16-18 (encapsulation, interfaces, inheritance)`
7. `Deep-rewrite the remaining sessions: 24, 26-27, 29-34; finish 20-22`
8. This commit (final `SOURCE_MAPPING.md`/`REBUILD_STATUS.md` update).

## Baseline integrity

No write operations were performed against `practice-07092026` or `csharp-refresher` —
both were only read from throughout this entire task. No destructive git operations,
force-pushes, or remote pushes were performed.

The destination remote is `https://github.com/PinkMachine19/csharp-learn-with-ai.git`.
**Not pushed** — left for the user to review and push themselves, per the task instructions.

## If further work is wanted

The course is now content-complete and fully verified against the checks this repository's
own tooling provides. Reasonable next steps, not required but worth naming:

1. Have a second reviewer (human or a fresh agent session) spot-check a sample of sessions
   against `practice-07092026` directly, independent of this session's own claims.
2. Consider whether any of the steps-1-39-derived sessions (2-4, 7-18) would read better
   merged, now that they carry real, substantial content rather than placeholder text.
3. Push to the remote and confirm a real GitHub Pages deployment renders correctly, once the
   user has reviewed the changes.
