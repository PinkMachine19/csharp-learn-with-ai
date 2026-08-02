# Course Reconstruction Plan

> **Superseded.** This plan's claims about content quality, its "no real payroll/timekeeping
> application exists" conclusion (section 6), and its choice of the invented "TimeLedger"
> domain (section 19) were wrong: a real Employee/ClockEntry/PayrollService application
> exists at `practice-07092026`. See `SOURCE_MAPPING.md` at the repository root for the
> authoritative, current mapping and `REBUILD_STATUS.md` for honest current status. The site
> architecture, generator, and validation tooling this plan describes (sections 21-22) were
> reused as-is and remain accurate. Retained below for historical context only.
>
> **Also superseded:** the "34 sessions" figure below (and the 34-session curriculum list)
> reflects the session count at the time this plan and the subsequent rebuild were written.
> The course was later reorganized to 35 sessions by splitting the original Session 1 into
> two sessions — see `SOURCE_MAPPING.md`'s "Session 01/02 split" section and
> `site/data/course-manifest.json` for the current, authoritative structure.

## 1. Source repository assessment

The source is a local-first course dashboard and planning system rather than a coherent learner-facing C# course. Its useful technical ideas are embedded in 80 planned steps and 163 substeps, but much of the material is coupled to private preparation context, generated handoff data, and application paths that do not exist in the repository. The source working tree was already dirty before this audit and remains read-only.

## 2. Source technology and build structure

- Two near-duplicate static dashboards: `course-dashboard/` and `react-dashboard/`.
- Vanilla HTML, CSS, and JavaScript with JSON data, JSON schemas, local storage, optional MongoDB synchronization, and browser tests.
- Two duplicate ASP.NET Core AI backend projects named `AiBackend.csproj`.
- No solution file and no canonical payroll/timekeeping application described by the curriculum.
- No C# unit-test project. Six JavaScript test files exist across the duplicated dashboards.
- Source branch: `master`; audited HEAD: `b600d14e5e9134ec4f3a15702332b56ca8d3543f`.
- The working copy reports remote `https://github.com/parmdeepchhabra/csharp-refresher.git`, which differs from the remote URL supplied in the project brief.

## 3. Existing session inventory

The syllabus contains 80 steps in 12 sections:

| Source section | Steps | Range |
|---|---:|---|
| Tool Fluency | 6 | 001–006 |
| Core C# | 7 | 007–013 |
| Collections | 9 | 014–022 |
| Classes | 9 | 023–031 |
| Object-Oriented Design | 8 | 032–039 |
| Timekeeping Feature | 5 | 040–044 |
| Language and Data Fundamentals | 4 | 045–048 |
| ASP.NET Core and REST APIs | 8 | 049–056 |
| SQL and EF Core | 5 | 057–061 |
| Security and Testing | 4 | 062–065 |
| DevOps | 3 | 066–068 |
| System Design and Interview Readiness | 12 | 069–080 |

These records are plans, not synchronized and independently navigable course sessions.

## 4. Existing lab inventory

Labs are embedded as substeps inside `syllabus.json`; there is no normalized lab area. Many instructions reference absent models, repositories, DTOs, controllers, and services. Potentially useful lab ideas include console experiments, collections, object modeling, timekeeping workflows, LINQ, async, APIs, EF Core, and tests. Every retained lab must be reconstructed against real destination code.

## 5. Existing quiz inventory

There is no conventional per-session pre/post quiz collection. `questions.json` contains 16 tracked questions or misconceptions, while syllabus reflection/check fields vary by step. Useful misconceptions around nullability, readonly initialization, repositories, equality, LINQ, and dependency injection will be rewritten as permanent prediction questions.

## 6. Existing application inventory

The only C# application code is the duplicated dashboard AI backend: provider interfaces and fake/Azure implementations, narration, question answering, error logging, audio caching, persistence, and API startup. The payroll/timekeeping application repeatedly referenced by the syllabus is absent.

## 7. Existing test inventory

- Three Playwright-oriented `.mjs` tests and two fixtures under each dashboard.
- No application unit tests and no .NET test project.
- Baseline JavaScript tests fail before execution because `playwright` is not installed or declared at the dashboard root.

## 8. Problems found

- Private interview, recruiter, employer, resume, company, deadline, and personal-progress framing is pervasive.
- The dashboard and backend are duplicated under two names.
- The curriculum describes application code that is not present.
- Documentation claims an architecture that cannot be verified against code.
- Eighty uneven steps range from tiny editor actions to multi-concept architecture topics.
- Advanced concepts sometimes precede their foundations.
- Static-site, synchronization, speech, AI, MongoDB, Docker, and dashboard features overwhelm the learning mission.
- Generated handoffs, prompt fragments, transient progress, audio, database output, and operational scripts are mixed with course material.
- Encoding artifacts appear in learner-facing content.
- The working tree is dirty and includes tracked edits plus large untracked duplicates.

## 9. Documentation and code mismatches

- Syllabus paths for models, services, repositories, controllers, DTOs, EF Core, and tests do not exist.
- `architecture.json` models an absent payroll/timekeeping application.
- README language describes 78 steps while the current syllabus contains 80.
- Runtime local-storage/synchronization state can diverge from the claimed canonical JSON.
- The source .NET build could not be evaluated on this machine because the .NET SDK is unavailable.

## 10. Duplicate or obsolete material

`react-dashboard/` substantially duplicates `course-dashboard/`, including backend, data, schemas, scripts, styles, and tests. Audio clips, database files, generated output, handoff generators, sync state, private progress, and prompt documents are obsolete for the new course.

## 11. Material worth preserving

Preserve conceptually: foundational C# syntax and types; nullability; collections; classes; encapsulation; composition; interfaces; LINQ; exception boundaries; async/cancellation; testing seams; dependency injection; ASP.NET Core basics; EF Core execution behavior; configuration/logging; and the compact timekeeping idea as inspiration for a deterministic domain.

## 12. Material requiring complete rewriting

All learner-facing prose, labs, quizzes, diagrams, navigation, application instructions, and code references require rewriting. Technical explanations must replace stack/heap shortcuts and clarify value/reference behavior, parameter passing, equality, deferred execution, `Task` versus thread, DI lifetimes, and `IEnumerable` versus `IQueryable`.

## 13. Material to merge

Merge editor steps 001–006 into project structure and feedback loops; list operations 014–019 into two sessions; class construction steps 023–027 into two sessions; interface/service/repository/DI planning into a dependency-ordered design sequence; HTTP/REST/controllers/routing into two sessions; and overlapping inheritance/abstract/polymorphism material into two sessions.

## 14. Material to split

Split nullability into nullable value/reference behavior; memory behavior into assignment, parameter passing, and equality; LINQ into pipelines, grouping/aggregation, and execution timing; async into await flow, concurrency, and cancellation/errors; testing into fundamentals, test doubles, and DI behavior; EF Core into context/tracking, queries/execution, and application workflow.

## 15. Material to omit

Omit company-specific preparation, mock interviews, storytelling, resume analysis, recruiter advice, personal history, AI handoffs, learner progress records, voice/audio features, MongoDB sync, dashboard error-log infrastructure, nonessential DevOps sprawl, and generated or archived output.

## 16. Existing-session-to-new-session mapping

| Source steps | Destination sessions | Treatment |
|---|---|---|
| 001–013 | 01–04 | Merge and rewrite foundations |
| 014–022 | 10–12 | Merge collections; add interface hierarchy |
| 023–031 | 05–06, 16 | Merge class basics; defer composition |
| 032–039 | 16–19, 29 | Reorder design and DI |
| 040–044 | Milestones across 05, 12, 20, 30, 34 | Retain domain ideas; replace absent code |
| 045 | 20–22 | Split LINQ behavior |
| 046, 078 | 23–24 | Merge error handling and resource boundaries |
| 047–048 | 25–27 | Split async flow, concurrency, cancellation |
| 049–056 | 32–33 | Condense application integration |
| 057–061 | 30–31, 34 | Rewrite EF Core and execution behavior |
| 062 | 33 | Retain proportional API boundary concepts |
| 063–065 | 28–29, 34 | Split unit, doubles/DI, integration |
| 066–068 | Workflow notes | Keep commit discipline; omit infrastructure sprawl |
| 069–072 | Omit | Temporary preparation framing |
| 073–075 | 17–18 | Merge and reorder OOP behavior |
| 076 | 07–09 | Split memory/type behavior |
| 077 | 19, 29 | Split DI basics and lifetimes/testing |
| 079 | 06 | Merge initialization forms |
| 080 | 21 | Retain grouping/join/aggregation concept |

## 17. Proposed curriculum layers

1. C# and .NET Foundations
2. Memory and Type Behavior
3. Collections and Generics
4. Object-Oriented Design
5. LINQ and Data Transformation
6. Errors and Resource Management
7. Asynchronous Programming
8. Testing and Dependency Injection
9. Data Access and Application Integration

## 18. Proposed final session order

The proposed course contains 34 sessions of approximately 35–45 minutes:

1. The .NET Solution and Feedback Loop
2. Variables, Expressions, and Numeric Types
3. Control Flow and Pattern-Based Decisions
4. Methods, Parameters, Scope, and Return Values
5. Classes, Objects, Properties, and Constructors
6. Initialization, Nullability, and Invariants
7. Value and Reference Assignment
8. Parameter Passing with `ref`, `out`, and `in`
9. Strings, Records, Structs, and Equality
10. Arrays, Lists, and Enumeration
11. Dictionaries, Sets, and Lookup Semantics
12. Collection Interfaces and `IEnumerable<T>`
13. Generic Types and Methods
14. Generic Constraints
15. Variance at API Boundaries
16. Encapsulation and Composition
17. Interfaces and Polymorphism
18. Abstract Classes, Inheritance, and Overrides
19. Dependency Direction and Constructor Injection
20. LINQ Pipelines with `Where`, `Select`, and Ordering
21. Grouping, Joining, and Aggregation
22. Deferred Execution, Materialization, and Query Sources
23. Validation, Return Values, and Exceptions
24. Exception Propagation, `IDisposable`, and `using`
25. Tasks, Threads, and Awaitable Work
26. Sequential and Concurrent Asynchronous Flow
27. Cancellation and Asynchronous Exceptions
28. Unit Tests and Arrange–Act–Assert
29. Test Doubles, DI Lifetimes, and Service Tests
30. EF Core Context, Entities, and Tracking
31. EF Core Queries: In-Memory versus Database Execution
32. ASP.NET Core Requests, Routing, and DTO Boundaries
33. Validation, Logging, and API Error Responses
34. Integrated Workflow and End-to-End Verification

Session 15 and Sessions 32–34 may be marked advanced or application milestones, but prerequisites remain explicit.

## 19. Proposed canonical course application

Use **TimeClock**, a compact time-entry application. It naturally supports value objects, nullable completion state, collections, validation, duration calculations, LINQ summaries, exceptions, async persistence, cancellation, services, interfaces, DI, EF Core, API DTOs, and tests. It will begin as a deterministic console workflow and grow only when a taught concept needs it.

## 20. Application synchronization strategy

The repository will represent the accumulated end state. Each manifest entry will identify its prerequisite, exact files changed, validation command, and suggested commit. Session commits form the reproducible progression. Validation will confirm every referenced path and identifier; each session commit must build and pass relevant tests before completion.

## 21. Proposed site architecture

Build a dependency-light static site with generated HTML, shared CSS, and small vanilla-JavaScript modules. Store sessions and metadata as structured data/templates, generate Home, Syllabus, Sessions, Quizzes, and Labs, and use a configurable `/csharp-learn-with-ai/` base path. Reuse components for headers, visual cards, quizzes, expected files, checkpoints, reviews, reflections, and navigation. Opening diagrams will be original accessible inline SVGs.

Reference-course observations: five primary navigation areas; clear curriculum cards and rules on the home page; Session 19 uses eight revealable opening visuals, an 11-part lesson sequence, prediction and observation quizzes, seven code blocks, an expected-files table, and previous/syllabus/next navigation. The new site will preserve that instructional rhythm while improving SVG labels and avoiding copied React prose or code.

## 22. Validation strategy

- Build the solution and run all .NET tests.
- Generate the site and serve it under both `/` and `/csharp-learn-with-ai/`.
- Validate manifest schema, unique IDs, prerequisites, syllabus coverage, required sections, lab/quiz paths, expected files, and previous/next links.
- Parse generated HTML to verify internal links, controls, accessible SVG descriptions, and navigation.
- Run browser tests for reveal cards, quizzes, advancement threshold, keyboard interaction, and responsive navigation.
- Scan learner-facing content for absolute paths, private framing, profanity, AI prompt fragments, encoding artifacts, and obsolete source references.

## 23. Migration progress checklist

- [x] Confirm source and parent paths.
- [x] Inspect source status, HEAD, and remote without changing them.
- [x] Inventory 80 source steps, 163 substeps, applications, and tests.
- [x] Inspect reference course home and Session 19.
- [x] Assess source build/test baseline from a disposable copy.
- [x] Select a 34-session dependency-ordered curriculum.
- [x] Select the TimeClock canonical domain.
- [x] Create and commit the destination foundation.
- [x] Create the source audit and reconstruction plan.
- [x] Phase 2: implement site foundation, manifest, generation, and validation.
- [x] Phase 3: create canonical .NET solution and tests.
- [x] Phase 4+: reconstruct all 34 sessions in validated batches.
