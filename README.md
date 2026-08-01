# C#/.NET Learn with AI

**A Practical C# and .NET Refresher**

This repository contains a professional, documentation-first course for developing dependable competence in modern C# and .NET. It combines precise mental models, small experiments, focused labs, quizzes, code review, automated tests, and incremental source-control checkpoints.

## Course status

All 34 dependency-ordered sessions are complete. The generated course contains lessons, labs, quizzes, accessible inline diagrams, and a cumulative TimeLedger application spanning C# foundations through ASP.NET Core and EF Core integration.

## Repository areas

- `site/` — GitHub Pages course site
- `src/TimeLedger.Domain/` — domain model and business rules
- `src/TimeLedger.App/` — deterministic console application
- `src/TimeLedger.Infrastructure/` — EF Core persistence and integrated workflows
- `src/TimeLedger.Web/` — ASP.NET Core API boundary
- `tests/TimeLedger.Domain.Tests/` — xUnit domain and integration tests
- `tools/` — course and site validation

The repository has an independent history and intentionally reconstructed course material.

## Published course

GitHub Pages: <https://pinkmachine19.github.io/csharp-learn-with-ai/>

## Requirements

- .NET 10 SDK, pinned by `global.json`
- Node.js 20 or later for the static course site

## Run the application

```powershell
dotnet run --project src/TimeLedger.App/TimeLedger.App.csproj
```

## Build and test the solution

```powershell
dotnet build TimeLedger.sln --configuration Release
dotnet test TimeLedger.sln --configuration Release --no-build
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
