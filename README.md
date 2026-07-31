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
