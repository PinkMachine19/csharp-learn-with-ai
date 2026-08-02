# C#/.NET Learn with AI

**A Practical C# and .NET Refresher**

This repository contains a professional, documentation-first course for developing dependable competence in modern C# and .NET. It combines precise mental models, small experiments, focused labs, quizzes, code review, automated tests, and incremental source-control checkpoints.

## Course status

All 35 dependency-ordered sessions build, validate, and publish. The generated course contains lessons, labs, quizzes, accessible inline diagrams, and a cumulative TimeClock application -- a renamed, byte-faithful port of the real `practice-07092026` Employee/ClockEntry/PayrollService app, not an invented domain -- spanning C# foundations through ASP.NET Core and EF Core integration. 12 of 35 sessions are deep-rewritten against verified real source; the remaining 23 currently carry a verified mechanical rename onto the real domain's vocabulary without session-specific real-code grounding yet. See `SOURCE_MAPPING.md` and `REBUILD_STATUS.md` for the exact, honest per-session status.

Original Session 1 ("Scaffolding the Solution") was later split into Session 01 (scaffolding + standard project-folder organization) and a new Session 02 (project references and dependency direction) — see `SOURCE_MAPPING.md`'s "Session 01/02 split" section for what moved where.

## Repository areas

- `site/` — GitHub Pages course site
- `src/TimeClock.Domain/` — domain model and business rules
- `src/TimeClock.App/` — deterministic console application
- `src/TimeClock.Infrastructure/` — EF Core persistence and integrated workflows
- `src/TimeClock.Web/` — ASP.NET Core API boundary
- `tests/TimeClock.Domain.Tests/` — xUnit domain and integration tests
- `tools/` — course and site validation

The repository has an independent history and intentionally reconstructed course material.

## Published course

GitHub Pages: <https://pinkmachine19.github.io/csharp-learn-with-ai/>

## Requirements

- .NET 10 SDK, pinned by `global.json`
- Node.js 20 or later for the static course site

## Run the application

```powershell
dotnet run --project src/TimeClock.App/TimeClock.App.csproj
```

## Build and test the solution

```powershell
dotnet build TimeClock.sln --configuration Release
dotnet test TimeClock.sln --configuration Release --no-build
```

## Build and validate the course site

```powershell
npm test
npm run serve
```

Open `http://127.0.0.1:4173/csharp-learn-with-ai/` after starting the local server.
## Project Status

This project is intentionally public while it is still evolving.

The repositories in this academy are my personal learning and reference material. They combine my professional software engineering experience, topics I am actively learning, and ideas developed through extensive discussions with AI.

AI has been used to help organize the curriculum, generate initial drafts, create code examples, suggest exercises, review documentation, and accelerate development.

That does not mean I assume the generated content is correct.

The purpose of publishing these repositories early is to make the material easily accessible from anywhere and to document my own learning journey. As I work through each course, I personally review, validate, correct, refactor, expand, and sometimes completely rewrite sections based on what I learn.

Because of that, some sessions may be fully validated while others remain drafts or works in progress. Each repository includes status indicators so readers can distinguish between planned, drafted, implemented, and validated content.

If you discover an error, inconsistency, or a better approach, please assume it is part of an evolving project rather than a finished product. Constructive feedback is always appreciated.

The goal is not to present myself as the ultimate authority on these subjects. The goal is to build a high-quality collection of practical engineering references that improve over time through testing, experience, and continual refinement.
