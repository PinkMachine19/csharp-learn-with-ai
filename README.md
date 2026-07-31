# C#/.NET Learn with AI

**A Practical C# and .NET Refresher**

This repository is the foundation for a professional, documentation-first course that develops dependable competence in modern C# and .NET. The course will combine precise mental models, small experiments, focused labs, quizzes, code review, automated tests, and incremental source-control checkpoints.

## Course status

The course foundation and canonical TimeLedger application are established. The curriculum contains 34 planned sessions; complete learner-facing sessions will be reconstructed and validated in later batches.

## Planned repository areas

- `site/` — GitHub Pages course site
- `src/TimeLedger.Domain/` — domain model and business rules
- `src/TimeLedger.App/` — deterministic console application
- `tests/TimeLedger.Domain.Tests/` — xUnit domain tests
- `tools/` — course and site validation

No Git remote is configured. The repository has a fresh history and is independent of all source material reviewed during reconstruction.

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
