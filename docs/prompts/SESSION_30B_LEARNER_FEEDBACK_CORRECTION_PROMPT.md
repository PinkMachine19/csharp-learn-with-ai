# Codex Prompt — Correct Session 30B from Learner Feedback

Perform a focused learner-feedback correction pass on **Session 30B — Dependency Injection Lifetimes** in the C# Learn with AI course.

Use the repository's actual current state. Read these files completely before editing:

- `docs/LAB_STRUCTURE_STYLE.md`
- `docs/LEARNER_FEEDBACK.md`
- `site/data/sessions/session-30.json`
- `site/data/sessions/session-30B.json`
- `site/data/sessions/session-31.json`
- The learner repository's active branch, ScratchPad project file, `Program.cs`, and any in-progress `Session30B/LifetimeExperiments.cs`

Do not complete, rewrite, clean up, or otherwise change the learner's in-progress implementation. Correct course lesson data, generated representations, authoring support, and documentation only.

## Preserve the lesson boundary

- Keep Session 30B as a primary cumulative lesson between Sessions 30 and 31.
- Keep it focused on `IServiceCollection`, `ServiceProvider`, the composition root, transient/scoped/singleton lifetimes, scopes, disposal, and reference identity.
- Keep the permanent ScratchPad experiment.
- Do not move DI container registration into production.
- Do not introduce EF Core, HTTP, async work, repositories, mocks, or new production services.
- Do not modify Session 31 or later implementation content.
- Keep complete solutions behind Solution Reveal.
- Keep visible learner instructions paste-ready and TTS-friendly.

## Primary learner-experience problem

The learner understood the lifetime rules but became bored while typing several nearly identical resolution and `ReferenceEquals` blocks. The repetition stopped producing new understanding, so the learner began copying and pasting merely to finish.

Correct the lab so it distinguishes:

- **Setup code:** package installation, empty marker declarations, provider creation, scope creation, and repeated display scaffolding that may be safely pasted when it is not the retrieval target.
- **Learning code:** choosing a lifetime, predicting reuse, selecting which scope resolves an object, and interpreting the `ReferenceEquals` result. The learner should actively write or complete these parts.

Do not equate understanding with manually retyping boilerplate. Retain enough retrieval practice to prove the learner understands each lifetime, but remove redundant typing after the pattern is established.

Prefer a progression such as:

1. The learner writes the first complete transient comparison with guidance.
2. The lesson provides concise setup for later comparisons.
3. The learner predicts each result and fills in the meaningful changing pieces: marker type, first or second scope, expected identity, and lifetime explanation.
4. The learner runs once and reconciles predictions with output.

Use a compact prediction table if it improves the exercise:

| Registration | First resolution | Second resolution | Predicted `ReferenceEquals` |
|---|---|---|---|
| Transient | first scope | first scope | false |
| Scoped | first scope | first scope | true |
| Scoped | first scope | second scope | false |
| Singleton | first scope | second scope | true |

Do not expose the entire completed class outside Solution Reveal.

## Correction 1 — Offer the package CLI command

The learner immediately recognized that a package reference can be added through the .NET CLI. The lesson should allow the established professional command:

```powershell
dotnet add src/PinkMachine19.TimeClock.ScratchPad/PinkMachine19.TimeClock.ScratchPad.csproj package Microsoft.Extensions.DependencyInjection --version 10.0.0
```

Explain that the command updates the project file and restores the package. Manual project-file editing may remain as an explanation or alternative, but it must not be presented as the only valid workflow.

## Correction 2 — Create marker types before registration

The lesson currently registers `TransientMarker`, `ScopedMarker`, and `SingletonMarker` before those types exist. This causes avoidable unresolved-type errors and led the learner to suspect a missing namespace.

Reorder the steps so the three nested marker classes exist before registration references them.

Explain:

- The marker types are nested inside `LifetimeExperiments`, so no additional namespace is required.
- They are intentionally empty because the experiment observes object identity only.
- Holding behavior constant makes lifetime registration the only changing variable.

Use the memory anchor:

> Blank marker; visible identity.

Avoid unnecessary red squiggles unless diagnosing one is the explicit learning objective.

## Correction 3 — Teach new DI syntax before asking for composition

Do not ask the learner to invent unfamiliar third-party API syntax from prose. On first use, show and read the relevant grammar:

```csharp
services.AddTransient<TransientMarker>();
services.AddScoped<ScopedMarker>();
services.AddSingleton<SingletonMarker>();
```

Explain each part:

- `services` is the registration collection.
- `AddTransient`, `AddScoped`, or `AddSingleton` selects a reuse rule.
- `<MarkerType>` identifies the registered service type.
- `()` invokes the registration method.

Preserve active participation by asking the learner to predict, label, or complete the next registration after the first syntax is demonstrated.

## Correction 4 — Refresh the generic Resolve helper

Repository evidence shows Sessions 14 and 15 previously taught and practiced a private static generic method with a constraint. A separate prerequisite side lab is not necessary for this lesson solely because `Resolve<T>` is generic.

However, Session 30B combines that older grammar with unfamiliar DI types and the new `notnull` constraint. Before asking the learner to write the helper, provide a compact retrieval refresher for:

```csharp
private static T Resolve<T>(IServiceScope scope)
    where T : notnull
```

Read it from left to right:

- `private`: used only inside this experiment.
- `static`: uses its parameter and no `LifetimeExperiments` instance state.
- The first `T`: return type.
- `Resolve<T>`: declares the method's type parameter.
- `IServiceScope scope`: ordinary method parameter.
- `where T : notnull`: requested service type cannot be nullable.

Substitute one concrete call:

```csharp
TransientMarker marker = Resolve<TransientMarker>(firstScope);
```

State explicitly that every `T` becomes `TransientMarker` for that call. Then explain that `GetRequiredService<T>()` either returns a registered non-null service or throws when the registration is missing.

Do not require the learner to rediscover this entire signature through IntelliSense.

## Correction 5 — Explain disposable discovery and ownership

The learner asked how to know whether `ServiceProvider` and `IServiceScope` should use `using`.

Add a short explanation near provider and scope creation:

- Hover the type or use Go to Definition and look for `IDisposable` or `IAsyncDisposable`.
- Documentation and examples may state that the caller owns the returned object.
- The compiler rejects a `using` statement or declaration for an incompatible type.
- Objects representing scopes, providers, streams, connections, files, timers, or operating-system resources commonly require disposal, but actual type and ownership information remain authoritative.
- `ServiceProvider` owns the scopes and container-created disposable services.
- Objects declared with `using` are disposed in reverse declaration order: second scope, first scope, then provider.

Use the ownership memory anchor:

> I created it, it is disposable, so I probably own its disposal—unless the API says otherwise.

Keep this explanation proportional; do not turn the lifetime lab into a full `IDisposable` lesson.

## Correction 6 — Preserve prediction as the active learning task

The lab's real intellectual work is predicting identity across resolution boundaries. Before each comparison, make the learner commit to `true` or `false` and explain why.

Use these memory anchors:

- `Transient: new every request.`
- `Scoped: one per scope.`
- `Singleton: one per provider.`

After running, require the learner to reconcile each observed Boolean with the scope/provider boundary. Do not add more repetitive object-resolution code merely to increase step count.

Adjust the final numbered step count if necessary. Granularity and learning value matter more than preserving 14 steps. Keep the lesson completable in 35–40 minutes and update all `Step n/n` labels consistently.

## Course-wide drills design note

Preserve and improve the course-design note requesting a dedicated optional **Drills** section across all completed sessions. Do not implement the entire drills feature as part of this focused Session 30B correction unless separately authorized.

The future drills section should:

- Be optional and never become a cumulative prerequisite.
- Organize short exercises by session, layer, and concept.
- Make each drill repeatable in roughly one to three minutes.
- Put answers behind Reveal.
- Focus on retrieval, prediction, signature reconstruction, error correction, and small code variations.
- Let learners practice weak syntax without repeating a complete 40-minute lesson.

Record Session 30B drill candidates including:

- Reconstruct the `Resolve<T>` signature from plain English.
- Label its generic and ordinary parameters.
- Substitute a concrete marker type for `T`.
- Write one registration for each lifetime.
- Predict identity within and across scopes.
- Identify provider/scope ownership and reverse disposal order.
- Correct a missing marker type, wrong scope, wrong lifetime, or malformed generic call.

## Purpose reminders

Keep or improve unnumbered purpose checkpoints. Add them where the learner is likely to lose the point:

- After marker creation and registration: the container has rules but has created no marker instances yet.
- After provider and scope creation: resolution boundaries now exist.
- Before identity comparisons: the goal is prediction, not typing volume.
- Before `Program.cs`: the experiment needs a caller to display evidence.
- Before running: the four Booleans should prove the three lifetime rules.
- Before final validation: distinguish focused behavior verification from cumulative solution health.

## Consistency and validation

Synchronize all affected representations:

- `site/data/sessions/session-30B.json`
- Generated lesson page
- Standalone lab page
- Quiz page if wording changes
- `docs/LEARNER_FEEDBACK.md`
- `docs/LAB_STRUCTURE_STYLE.md` only for genuinely course-wide rules
- Generator or validator support only when genuinely necessary

Validate:

1. Marker types are created before registrations reference them.
2. The package CLI workflow is available.
3. Third-party registration syntax is demonstrated before being required.
4. The generic helper receives an explicit Session 14/15 retrieval refresher.
5. `notnull`, `static`, `IServiceScope`, and `GetRequiredService<T>()` are explained.
6. Disposable discovery, ownership, using declarations, and reverse disposal order are explained.
7. Repeated setup is pasteable where appropriate, while predictions remain active learner work.
8. Purpose checkpoints are unnumbered and appear at natural transitions.
9. All step labels and denominators agree after any restructuring.
10. Complete implementation remains behind Solution Reveal.
11. Notes, Bookmark, and Shortcuts initialize on the alphanumeric Session 30B route.
12. Regenerate and validate the complete site.
13. Confirm the learner repository and production code remain unchanged.

Do not push unless explicitly requested.

## Final report

Report:

- Exact lesson corrections
- Exact files changed
- Final step count and purpose-checkpoint count
- What became pasteable setup versus active learning work
- Marker-declaration and registration order
- Generic-helper refresher added
- Disposal guidance added
- Prediction and output-verification design
- Course-wide drills note status
- Site generation and validation results
- Widget verification result
- Confirmation that learner and production code were unchanged
