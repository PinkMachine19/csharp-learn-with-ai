# Rebuild Status

This file was rewritten from scratch during the "replace TimeLedger with the real domain"
rebuild pass. Its previous "Complete... 64 of 64 tests... none required" claims were **not**
independently re-verifiable (the app they described, TimeLedger, was fictional) and are
superseded entirely by this document. Nothing below is asserted without having actually run
the referenced command in this session and reading its real output.

- **Source repositories (read-only):** `C:\Users\azureuser\repos\practice-07092026` (real
  application code), `C:\Users\azureuser\repos\csharp-refresher` (real curriculum intent —
  `course-dashboard/data/syllabus.json`, `decisions.json`, `concepts.json`)
- **Destination repository:** `C:\Users\azureuser\repos\csharp-learn-with-ai`
- **Current destination branch:** `main` (not pushed to remote — left for the user to review)
- **Current phase:** Substantially complete but explicitly **not** fully finished. The
  ".NET solution" and "mapping document" deliverables are done and verified. The "rebuild
  all 34 sessions" deliverable is partially done: 11 of 34 sessions were deep-rewritten
  against real, verified source; the other 23 carry a verified-correct mechanical rename
  (no TimeLedger/Worker/TimeEntry/DateTimeOffset artifacts anywhere) but not yet session-
  specific real-code grounding. See `SOURCE_MAPPING.md` for the exact per-session list.

## What was actually done, and how it was verified

1. **.NET solution rebuilt on the real domain.** `TimeLedger.sln` -> `TimeClock.sln`;
   `TimeLedger.Domain`/`.App`/`.Infrastructure`/`.Web` -> `TimeClock.*`. `ClockEntry`,
   `Employee`, `Address`, `EmployeeDto`, `IClockEntryRepository`, `IClockEntryService`,
   `IEmployeeRepository`, `IEmployeeService`, `ClockEntryRepository`, `EmployeeRepositor`,
   `ClockEntryService`, `EmployeeService`, and `PayrollService` are now byte-faithful ports
   of the real files in `practice-07092026`, including real bugs/typos kept intentionally
   (`GetDuartion()`, the `ClockIn`/`Clockout` casing mismatch, `EmployeeRepositor`'s missing
   "y", the public mutable `_clockEntries` field, the fake-async `GetClockEntry`, the dead
   `IEmployeeService` dependency in `PayrollService`, and `Program.cs`'s real unawaited
   `Clockout(1)` call). ~20 supporting teaching-example files (generics/variance/async/
   collections lessons) and their tests were updated to compile against the real
   `int EmployeeId`/`DateTime ClockIn`/`ClockOut` shape. A real xUnit+Moq
   `PayrollServiceTests.cs` mirrors the real repo's one test verbatim.
   - **Verified:** `dotnet build TimeClock.sln --configuration Release` ->
     `Build succeeded. 0 Warning(s) 0 Error(s)` (run twice, most recently after the Session
     34 content edits — same clean result both times).
   - **Verified:** `dotnet test TimeClock.sln --configuration Release --no-build` ->
     `Passed! - Failed: 0, Passed: 57, Skipped: 0, Total: 57` (also run twice, same result).
   - **Verified:** `dotnet run --project src/TimeClock.App/TimeClock.App.csproj
     --configuration Release` reproduces the real app's actual behavior: the leftover debug
     loop prints `0` through `9` (from `ClockEntryRepository.GetClockEntry`'s real cruft),
     and the final line is `Total hours worked: 4.270944444444444E-06` — a near-zero value,
     which is the real, documented consequence of `Program.cs`'s real unawaited `Clockout`
     call racing `CalculateTotalHours`. This is not a bug I introduced; it is the real
     application's real, verified behavior, reproduced faithfully.
2. **`SOURCE_MAPPING.md` written** at the repository root, mapping every session and every
   destination source file to its real origin (specific `practice-07092026` file, specific
   syllabus step/decision-log entry, or an explicit "new, clearly-labeled extension of the
   real domain, because X real gap exists" justification). It also lists, honestly, which
   sessions still need the same treatment.
3. **11 of 34 sessions deep-rewritten** against verified real source (read directly from
   `practice-07092026` and `syllabus.json`/`decisions.json` in this session, not assumed):
   Sessions 1 (already good pre-existing content), 5, 6, 19, 20, 21, 22, 23, 25, 28, 34.
   See `SOURCE_MAPPING.md`'s "Honest per-session status" section for exactly what each one
   covers and what real file/step/decision it cites.
4. **All 34 sessions mechanically corrected** (this pass touched every session file):
   `TimeLedger` -> `TimeClock`, `Worker` -> `Employee`, `TimeEntry` -> `ClockEntry`,
   `DateTimeOffset` -> `DateTime`, and the one remaining `IsOpen`/`TeamName` residue (in
   Sessions 22 and 6) were removed. Verified with:
   `grep -rl "TimeLedger\|DateTimeOffset\|IsOpen\|TeamName\|WorkerId" site/data/sessions/*.json`
   -> no matches.
5. **Site build and validation, run in this session:**
   - `npm run build` -> `Built 34-session course foundation ... Base path: /csharp-learn-with-ai/`
   - `npm run validate` -> `Validated 108 HTML pages and 34 manifest sessions. Base path
     verified: /csharp-learn-with-ai/. Navigation, interactions, SVG accessibility, content
     policy, and internal references passed.`
   These are the existing generator/validator scripts under `tools/`, reused as-is per the
   task's own guidance that the tooling was likely fine and only the content was fictional.

## What was not done — explicit, not glossed over

- **23 of 34 sessions still carry only the mechanical rename**, not session-specific
  real-code grounding. Most of these map to syllabus steps 1-39, which the source syllabus
  itself has empty `goal`/`why`/`mentalModel` fields for (title-only), so there was
  genuinely little real narrative to draw from for those; but Sessions 16-18 (encapsulation/
  interfaces/inheritance, which do have real `IClockEntryRepository`/`IEmployeeService`
  grounding available) and 24, 26, 27, 29-33 (which have real grounding available via
  Steps 43/46-48/63-65 and the real WebApi gaps) were not yet rewritten and still contain
  "The governing rule is..." template language. This is the single largest remaining gap.
- **`TimeClock.Web` is not yet controller-based.** It compiles and is renamed onto the real
  domain, but it still uses minimal APIs (`MapPost`) rather than mirroring the real
  `Parm.Practice.WebApi/Program.cs`'s `AddControllers()`/`MapControllers()`-with-zero-
  controllers shape, and does not yet reproduce the real missing-`IEmployeeService`-
  registration bug as a lab. Sessions 32-33 should be rewritten together with this fix.
- **Session 27, not 34, should be where the real CS4014 bug is actually fixed**, per the
  task brief's suggested placement; it currently happens in Session 34 only (Session 25
  identifies the bug; Session 34 fixes it — functionally complete, but the task brief
  implies Session 27, "Cancellation and Asynchronous Exceptions," is the more natural home).
- **`npm test` (build+validate combined) was not separately re-run** after the final content
  commit in this session, though `npm run build` and `npm run validate` were each run
  individually, successfully, after all content changes. `dotnet build`/`dotnet test` were
  each run twice, most recently after all changes.
- **No end-to-end GitHub Pages deployment check** was performed (no push was made; the task
  explicitly says not to push).

## Commits made this session (on `main`, not pushed)

1. `Rebuild .NET solution on the real Employee/ClockEntry/PayrollService domain` — the full
   solution rename, byte-faithful core file ports, and supporting-file fixes.
2. `Reground high-fidelity sessions in the real Employee/ClockEntry domain` — the 34-file
   mechanical rename plus the 9 deep session rewrites (Sessions 5, 6, 19-23, 25, 28) and the
   Session 34 CS4014-fix addition.
3. This commit (`SOURCE_MAPPING.md` + this file).

## Baseline integrity

No write operations were performed against `practice-07092026` or `csharp-refresher` — both
were only read from. `git status` on `csharp-learn-with-ai` was checked before starting; the
branch was clean (`nothing to commit, working tree clean`) prior to this session's changes.
No destructive git operations, force-pushes, or remote pushes were performed.

The destination remote is `https://github.com/PinkMachine19/csharp-learn-with-ai.git`.
**Not pushed** — left for the user to review and push themselves, per the task instructions.

## Recommended next steps, in priority order

1. Rewrite Sessions 16-18 (real interface/repository grounding already exists — highest
   value, lowest new-content burden).
2. Rewrite Sessions 26-27, moving the CS4014 fix into Session 27.
3. Rewrite Sessions 29-33, including the `TimeClock.Web` controller-based restructuring.
4. Rewrite Sessions 24 and 2-4/7-18 (foundations) for narrative consistency, even though
   the real syllabus has no source prose to ground them in beyond vocabulary/sequencing.
5. Re-run `dotnet build`, `dotnet test`, `npm test` one final time after all of the above,
   and update this file's numbers again before considering the rebuild complete.
