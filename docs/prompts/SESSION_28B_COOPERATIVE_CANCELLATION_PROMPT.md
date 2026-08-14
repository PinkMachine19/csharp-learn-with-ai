# Codex Prompt — Create Cumulative Session 28B

Create and implement a new cumulative lesson named **Session 28B — Cooperative Cancellation**.

This must be a real primary course lesson, not an optional side lab, sidebar, refresher, or supplemental module.

## Placement

```text
Session 28 — Observing Asynchronous Exceptions
Session 28B — Cooperative Cancellation
Session 29 — Unit Tests and Arrange–Act–Assert
```

Session 28B continues directly from the learner's completed Session 28 repository state. Update primary course navigation and prerequisites so Session 29 follows Session 28B.

## Before editing

1. Read `docs/LAB_STRUCTURE_STYLE.md` completely.
2. Read `docs/LEARNER_FEEDBACK.md` completely.
3. Inspect the learner repository's active `working` branch.
4. Inspect Session 28 and the current Session 29 boundary.
5. Verify the actual ScratchPad `Program.cs` and Session 28 experiment.
6. Inventory every course representation affected by inserting a primary lesson.

Do not modify production Domain, App, Infrastructure, Web, repository, or service code.

## Focused Session 28A correction pass

Treat the existing **Session 28 — Observing Asynchronous Exceptions** as Session 28A conceptually. Before inserting Session 28B, audit Session 28 against the learner feedback recorded in `docs/LEARNER_FEEDBACK.md`.

You may make focused Session 28 lesson corrections where the current generated lesson does not yet reflect that feedback. Do not redesign its scenario, change its primary exception-observation objective, or modify the learner's already completed Session 28 code unless a real compilation or behavioral defect exists.

Verify and correct these Session 28 details wherever necessary:

### Warning-free temporary methods

- `RunAsync` should initially be declared without `async` and temporarily return `Task.CompletedTask`.
- `FailAfterDelayAsync` should initially be declared without `async` and temporarily return `Task.CompletedTask`.
- When `Task.Delay` and `await` are introduced, explicitly instruct the learner to add `async` and remove `return Task.CompletedTask`.
- Explain that a non-async method returning `Task` must explicitly return a Task object.
- Explain that an `async Task` method has its Task created and managed by the compiler and must not explicitly return `Task.CompletedTask`.
- Contrast both forms with `void`, which gives the caller no completion handle.

### Method calls versus stored Tasks

The learner wrote `await failureTask()` after already calling `FailAfterDelayAsync()`.

Ensure Session 28 explicitly explains:

```csharp
// Parentheses invoke the method and return its Task.
Task failureTask = FailAfterDelayAsync();

// The variable refers to the returned Task object.
// Await the stored Task without parentheses.
await failureTask;
```

Visible instructions must explain this grammar without exposing more completed implementation than necessary. The complete method remains behind Solution Reveal.

### Awaiting Task versus Task<T>

The phrase “Do not discard the returned Task” caused the learner to write:

```csharp
var result = await asyncFailureExperiments.RunAsync();
```

Ensure Session 28 explains:

- Awaiting `Task` observes completion or failure but produces no assignable result value.
- Awaiting `Task<T>` produces a value of type `T`.
- `await asyncFailureExperiments.RunAsync();` observes the returned Task directly.
- Assigning the awaited expression to `var` is invalid when the method returns `Task` rather than `Task<T>`.
- Awaiting a Task is not discarding it.
- `_ = RunAsync();` explicitly discards the Task.
- A bare call without `await` also gives up deliberate completion control.

### Purpose reminders

The learner reported forgetting the reason for the exercise after several mechanical steps.

Add short, unnumbered Session 28 purpose checkpoints where needed, especially:

- After creating the faulting helper: explain that the learner now has a Task that will become faulted, and the next goal is to observe that failure deliberately.
- Before `Program.cs` integration: explain that the experiment needs an awaited caller so ScratchPad owns its completion.
- Before running: explain that the final continuation message proves the exception was caught and normal flow resumed.
- Before final build and tests: distinguish checking the experiment's behavior from protecting the cumulative solution.

Do not count these reminders as lab steps.

### Session 28 title and scope

- The primary Session 28 title must be **Observing Asynchronous Exceptions** or equally accurate wording.
- It must not promise cancellation.
- Session 28 should continue teaching faulted Tasks, awaited exception observation, Task ownership, and continuation after `catch`.
- Cancellation belongs in the new cumulative Session 28B.
- Update stale Session 28 headings, manifest text, navigation labels, or generated routes where necessary.
- If changing the existing route would break stable links unnecessarily, preserve a compatible redirect or document the route decision.

### Session 28 visible-instruction standard

- Use paste-ready C# comment blocks.
- Every instructional line in a C# block must start with `//`.
- Do not expose completed implementation statements in visible instructions.
- Keep the complete compiling `AsyncFailureExperiments` implementation and `Program.cs` integration inside Solution Reveal.
- Keep Session 28 at exactly 12 steps unless repository evidence shows a compelling reason to change it.

### Session 28 validation

Confirm:

1. All 12 step labels and totals are correct.
2. Temporary methods compile without avoidable warnings.
3. The method-call versus stored-Task distinction is explicit.
4. The `Task` versus `Task<T>` await-result distinction is explicit.
5. Purpose reminders appear at natural checkpoints.
6. Cancellation is no longer promised or partially taught in Session 28.
7. The complete solution remains behind Reveal.
8. The learner's completed Session 28 behavior remains intact.

Keep all Session 28 corrections in a focused change separate from the new Session 28B implementation when practical.

## Learning environment

Permanent ScratchPad notebook.

Create a distinct experiment under:

```text
src/PinkMachine19.TimeClock.ScratchPad/Session28B/
```

Use unique global type names because the learner currently does not use namespaces.

## Primary objective

Teach cooperative cancellation as a separate concept from failure.

The learner should understand:

- Cancellation is a request, not forced termination.
- `CancellationTokenSource` creates and controls the request.
- `CancellationToken` carries the request.
- A token parameter does nothing unless code observes or forwards it.
- `Task.Delay` accepts and observes a `CancellationToken`.
- Awaiting canceled work normally throws `OperationCanceledException`.
- Cancellation is different from an unexpected fault.
- `async` and `await` do not automatically create another thread.
- `CancellationTokenSource` should be disposed.
- Every created Task must be deliberately awaited.

Use one small ScratchPad scenario with simulated waiting. Do not claim `Task.Delay` is production I/O.

## Suggested experiment

A small document-processing or report-generation operation begins a simulated wait. A `CancellationTokenSource` requests cancellation before completion. The token is passed to a private async helper and then to `Task.Delay`. `RunAsync` awaits the operation inside `try`/`catch` and handles `OperationCanceledException`. The experiment prints that cancellation was requested, observed, and handled.

Do not introduce:

- `Task.Run`
- Production asynchronous repositories
- EF Core
- HTTP
- Dependency injection
- LINQ-generated Task collections
- `TaskCompletionSource`
- Background services
- Linked cancellation tokens
- `CancellationToken.Register`
- Timeout composition
- `Clockout`
- `GetClockEntry`
- `EntryBatchLoader`
- Fire-and-forget work

Keep advanced cancellation composition as future optional material.

## Instruction design

- Use short, TTS-friendly steps.
- Use `Step 1/n` through `Step n/n` consistently.
- Every visible implementation instruction must be a paste-ready C# comment block.
- Every instructional line inside a C# block must begin with `//`.
- Describe what to implement without exposing completed statements.
- Keep the complete implementation only inside Solution Reveal.
- State the exact project, folder, file, class, and containing method.
- Use warning-free temporary implementations.
- Before `async` is needed, return `Task.CompletedTask`.
- When `await` is introduced, explicitly tell the learner to add `async` and remove the explicit Task return.
- Explain that parentheses invoke a method, while a stored Task is awaited without parentheses.
- Explain that awaiting `Task` observes completion but produces no assignable value.
- Contrast this briefly with `Task<T>`, whose await produces `T`.
- Explain that “do not discard the Task” means await it; it does not mean assigning the awaited expression to `var`.

## Purpose-reminder rule

After every natural group of two to four mechanical steps, add a short unnumbered purpose checkpoint stating:

- What has been built so far.
- What behavior it currently provides.
- Why the next step matters.
- How it supports cooperative cancellation.

Add purpose reminders immediately before:

- `Program.cs` integration
- Running ScratchPad
- Final build and tests

Do not count purpose reminders as numbered steps.

## Suggested conceptual progression

1. Create the Session 28B file and sealed experiment class.
2. Add warning-free `RunAsync`.
3. Add a private helper initially returning `Task.CompletedTask`.
4. Convert the helper to `async` when `Task.Delay` with `CancellationToken` is added.
5. Introduce `CancellationToken` as a parameter.
6. Create and dispose `CancellationTokenSource` inside `RunAsync`.
7. Start the helper and store its Task.
8. Request cancellation.
9. Await the stored Task inside `try`.
10. Catch `OperationCanceledException`.
11. Print proof that cancellation was requested, observed, and handled.
12. Integrate and await the experiment from ScratchPad `Program.cs`.
13. Run ScratchPad.
14. Build the Release solution and run the complete tests with `--no-build`.

Adjust the final step count if a different granular breakdown is clearer, but keep the lesson completable in 35–40 minutes.

## Signature-reading help

Explain this signature near the relevant step:

```csharp
Task Delay(int millisecondsDelay, CancellationToken cancellationToken)
```

Explain:

- `millisecondsDelay` controls the intended wait.
- `cancellationToken` carries a cancellation request.
- Passing the token lets `Task.Delay` observe the request.
- The same token should be forwarded rather than replaced.
- A `CancellationToken` value does not itself cancel anything.
- `CancellationTokenSource.Cancel` requests cancellation.

## Explain OperationCanceledException

- It represents observed cancellation.
- It is expected control flow for this deliberate experiment.
- It is not the same as `InvalidOperationException` from Session 28.
- Catch it only where the caller deliberately translates or reports cancellation.

## Mental models

Create four distinct visuals:

1. Source and token: `CancellationTokenSource` owns the request; `Token` carries it.
2. Propagation: `RunAsync` passes one token to the helper, and the helper passes it to `Task.Delay`.
3. Observation timeline: work starts, cancellation is requested, `Task.Delay` observes it, and `await` surfaces `OperationCanceledException`.
4. Cancellation versus fault: cancellation is a cooperative stop request; fault is an operation failure.

Do not reuse the same generic box layout four times.

## Required learner files

- `src/PinkMachine19.TimeClock.ScratchPad/Session28B/[distinct experiment name].cs`
- `src/PinkMachine19.TimeClock.ScratchPad/Program.cs`

## Required course changes

- New Session 28B lesson JSON
- Primary course manifest
- Navigation and prerequisite metadata
- Build-sequence metadata
- Any generator or validator changes genuinely required to support a primary alphanumeric session identifier
- Learner-feedback or design-note update
- Generated lesson, standalone lab, and quiz pages

Do not modify Sessions 1–28 content except for necessary previous/next navigation metadata.

Do not rewrite Session 29 content except for its prerequisite or navigation connection to Session 28B.

## Validation

1. Verify Session 28 remains intact.
2. Verify visible instructions contain only paste-ready comments, not completed implementation statements.
3. Verify purpose checkpoints appear at natural intervals.
4. Verify the complete compiling solution stays behind Reveal.
5. Run ScratchPad in Release.
6. Confirm output proves cancellation was requested, observed, and handled.
7. Build `PinkMachine19.TimeClock.sln` in Release.
8. Run the complete tests with `--no-build`.
9. Confirm production code remains synchronous and unchanged.
10. Confirm no duplicate global type names exist.
11. Regenerate and validate all site output.
12. Confirm Session 28B is primary and not listed among side labs or refreshers.
13. Confirm Session 29 follows Session 28B.
14. Confirm no Session 30+ implementation content was modified.

Do not push.

## Final report

Report:

- Design decision
- Exact files changed
- Final step count
- Purpose reminders added
- Warning-free stub progression
- Cancellation propagation path
- ScratchPad output
- Build and test results
- Site validation result
- Confirmation that Session 28B is cumulative rather than optional
- Any remaining concerns
