# TimeLedger Application Progression

## Why TimeLedger

TimeLedger is a compact time-entry application that can grow without changing domains whenever the curriculum introduces a new concept. A time entry begins at a known instant, may remain open, and can later be completed. That small workflow supports observable examples for types, nullability, collections, object design, LINQ, exceptions, asynchronous work, tests, dependency injection, EF Core, and HTTP boundaries.

The application avoids payroll rules, external services, authentication, and infrastructure until the course has taught the concepts that justify them.

## Phase 3 foundation

The initial solution contains three projects:

| Project | Responsibility |
|---|---|
| `TimeLedger.Domain` | Holds the small domain model and its business rules. |
| `TimeLedger.App` | Runs a deterministic console example. |
| `TimeLedger.Domain.Tests` | Proves the domain rules with xUnit. |

`TimeEntry` is intentionally the only domain type. It records a worker identifier and clock-in time, allows one valid completion, and calculates duration only after completion.

## Planned growth

1. Foundation sessions explain the solution, expressions, methods, and the existing object.
2. Memory and collection sessions add small experiments and an in-memory set of entries.
3. Design sessions introduce services and interfaces only after their purpose is visible.
4. LINQ sessions add time summaries over real collections.
5. Error and async sessions introduce explicit boundaries, asynchronous storage, and cancellation.
6. Testing and DI sessions add seams, test doubles, and lifetime reasoning.
7. Integration sessions add EF Core persistence and a small ASP.NET Core API.

Each session must update documentation, code, tests, and the course manifest together. The solution must build and its tests must pass at every completed session commit.

## Reproducibility and quality policy

- Target .NET 10, the active LTS release selected for this rebuild.
- Pin the SDK feature band in `global.json` while allowing later patches in that band.
- Enable nullable reference analysis and implicit global usings.
- Treat compiler warnings as errors.
- Keep application output deterministic.
- Add packages only when a taught feature requires them.
- Do not hide warnings with suppressions.

