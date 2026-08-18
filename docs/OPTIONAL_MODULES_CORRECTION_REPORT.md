# Optional Modules Correction Report

## Executive summary

The repository contains six side labs and five Modern C# Refresher lessons. All eleven now create isolated exercise folders, state their own prerequisites, include complete setup and Solution reveals, and can be completed without a numbered session or another optional module. Navigation may suggest a nearby numbered session or refresher order, but the manifest and validator no longer encode completion prerequisites.

No Session 1–35 JSON, TimeClock production source, cumulative ScratchPad runner, or learner repository file was changed for this audit.

## Inventory and corrections

| Module | Category | Original problem | Scenario | Primary concept | Isolation and validation |
|---|---|---|---|---|---|
| VS Code Fluency (`01B`) | Side lab | Required the Session 01 solution and navigated production projects. | Disposable product-price calculator | Editor navigation, refactoring, diagnostics, and terminal workflow | Own console project; revealed code built and ran. |
| Formatting Console Output (`03B`) | Side lab | Appended TimeClock variables to cumulative ScratchPad. | Invoice and balance display | Formatting changes text, not stored numeric values | Own console project; revealed code built and ran. |
| Decision Syntax (`04C`) | Side lab | Was framed as dependent on Session 04. | Customer-support ticket priority | Choosing if/else, switch statement, or switch expression | Own console project; revealed code built and ran. |
| Properties (`05B`) | Side lab | Added session-named ScratchPad classes and modified its runner. | Normalized customer email and simple loyalty points | Backing field only when custom access behavior is needed | Own console project with unique `CustomerPropertyProfile`; revealed code built and ran. |
| Access Modifiers/API Boundaries (`19B`) | Side lab | Required Sessions 17–19 and modified App, Infrastructure, and ScratchPad. | Public document service with hidden formatter details | Accessibility from same- and cross-assembly callers | Own library and runner projects; both assemblies built and runner executed. |
| Outcome Contracts (`24B`) | Side lab | Required several sessions, used TimeClock terminology, and named no exact output file. | Product lookup, reservation, and payment outcomes | bool, nullable, result, exception, HTTP, and UI translations | Own console project; revealed code built and ran. |
| Platform Pieces (`R0`) | Refresher | New prerequisite mental model requested before platform and language history. | Source/compiler/assembly/runtime experiments | C#, CLR, libraries, SDK, compiler errors, and runtime exceptions | Own console project; revealed code built and ran. |
| Language Milestones (`R1`) | Refresher | Notes-only task used platform-specific shell commands and acted as a track prerequisite. | Toolchain compatibility report | Useful language milestones and compiler version feedback | Own console project; revealed code built and ran. |
| Generics/Lambdas/LINQ (`R2`) | Refresher | Setup and signature reading were too compressed. | Purchase-line total | Typed collections, delegates, and LINQ pipeline | Own console project; revealed code built and ran. |
| async/await (`R3`) | Refresher | Dense summary lacked sufficiently explicit standalone setup. | Document conversion | Task results, await, cancellation, and observed failure | Own console project; revealed code built and ran. |
| Patterns/Nullable (`R4`) | Refresher | Used course-adjacent shift language and weak older/modern comparison. | Optional package-delivery update | Nullable flow and property patterns | Own console project; revealed code built and ran. |
| Records/Construction (`R5`) | Refresher | Listed too many nearby features without one coherent objective. | Immutable subscription plan | Records, required/init, primary constructors, and collection expressions | Own C# 12+ console project; revealed code built and ran. |

## Cross-check classification

- Intentional illustrative references: every module says that it does not modify TimeClock or Sessions 1–35. These are isolation warnings, not implementation dependencies.
- Navigation-only references: side labs remain visually suggested near Sessions 01, 03, 04, 05, 19, and 24. Refresher cards remain ordered R0–R5 for discoverability. All refresher prerequisite fields are null.
- Shared framework/template references: all modules use the same site generator, lesson renderer, quiz renderer, and validator. Shared rendering does not create code or knowledge dependencies.
- Accidental coupling requiring correction: none remains in the optional JSON. Searches found no “continue from,” “complete Session,” cumulative `ScratchPad/Program.cs`, production project path, or refresher-prerequisite requirement.
- Duplicate global types: none across revealed solutions. Each exercise also compiles in its own project, so identical framework names cannot collide.
- Main cumulative build sequence: no optional artifact is listed in `site/data/build-sequence.json`.

## Validation

- JSON and generated pages: `npm run build` and `npm run validate` passed.
- Generated output: 168 HTML pages, including 6 side labs and 6 refreshers, passed navigation, interaction, SVG accessibility, content-policy, and internal-reference checks after R0 was added.
- Revealed code: 10 standalone console projects plus the Access Modifiers library/runner pair built under .NET 10 with 0 warnings and 0 errors.
- Runtime: all 11 examples ran successfully.
- Isolation searches: no implementation dependency on a numbered session, production project, cumulative ScratchPad runner, or another optional module remains.

## Remaining optional improvements

- A future editor-only appendix could add screenshots for VS Code shortcuts without changing its runnable exercise.
- R3 could later offer separate optional sidebars for deterministic cancellation testing and asynchronous streams.
- R5 could later split advanced collection-pattern features into a separate refresher; they are intentionally not included now.
