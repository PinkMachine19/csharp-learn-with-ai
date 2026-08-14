# Codex Prompt — Correct Session 28B from Learner Feedback

Perform a focused learner-feedback correction pass on **Session 28B — Cooperative Cancellation** in the C# Learn with AI course.

Use the repository's actual current state. Read these files completely before editing:

- `docs/LAB_STRUCTURE_STYLE.md`
- `docs/LEARNER_FEEDBACK.md`
- `site/data/sessions/session-28B.json`
- `site/data/sessions/session-28.json`
- The active learner repository's Session 28B experiment and ScratchPad `Program.cs`

Do not complete, rewrite, or otherwise change the learner's lab implementation. Correct the course lesson, generated representations, authoring support, and documentation only.

## Preserve the lesson

- Keep Session 28B as a primary cumulative lesson between Sessions 28 and 29.
- Keep its cooperative-cancellation objective, report-processing scenario, 14 numbered steps, purpose checkpoints, expected output, and production-code boundary.
- Do not introduce advanced cancellation topics.
- Do not modify production Domain, App, Infrastructure, Web, repository, or service code.
- Do not modify Session 29 or later implementation content.
- Keep complete implementations behind Solution Reveal.
- Keep visible implementation instructions as paste-ready `//` comments.

## Correction 1 — Teach a using declaration before requiring it

The lesson asked the learner to create a `CancellationTokenSource` with a `using` declaration. The learner only knew the traditional `using (...) { }` block and reasonably wrote:

```csharp
var cancellationSource = new CancellationTokenSource();
using (cancellationSource)
{
    var cancellationToken = cancellationSource.Token;
}
```

Correct the lesson so it explicitly teaches the two valid grammatical forms before asking the learner to use one:

```csharp
// Traditional using block:
using (SomeDisposable resource = new())
{
    // resource is available inside this block.
}

// Using declaration:
using SomeDisposable resource = new();
// resource remains available until the containing scope ends.
```

Explain clearly:

- A `using` block calls `Dispose` when execution leaves its block and creates a nested scope.
- A `using` declaration has no additional braces and calls `Dispose` when execution leaves the containing scope.
- In this lab, that containing scope is `RunAsync`.
- A normal local variable is not automatically disposed merely because the method ends or the variable goes out of scope.
- Garbage collection and deterministic disposal are different mechanisms.
- `CancellationTokenSource` implements `IDisposable` and may own resources that should be released.
- It is not necessary to pretend this tiny ScratchPad source has the same cost as a database connection. Teach the general ownership rule accurately.

At the relevant lab step, show the grammatical shape without exposing more of the completed Session 28B implementation than necessary.

## Correction 2 — Explain exactly when an async method starts

After writing:

```csharp
Task processingTask = ProcessReportAsync(cancellationToken);
```

the learner thought the operation might not start until:

```csharp
await processingTask;
```

Correct the concept explanation and the relevant lab step with this explicit timeline:

1. `ProcessReportAsync(cancellationToken)` invokes the method immediately.
2. The method runs synchronously until it reaches an awaited operation that is not yet complete.
3. It then returns a Task representing the remaining operation.
4. Assignment stores that Task; assignment neither starts nor delays the work.
5. `await processingTask` does not start the method. It waits for and observes the already-started Task's completion, cancellation, or failure.

Use this memory anchor:

> The call starts the work. The Task tracks the work. Await observes the work.

Keep the existing explanation that parentheses invoke the method and that a stored Task is awaited without parentheses.

## Correction 3 — Explain why the source is canceled, not the Task

The learner tried to write:

```csharp
processingTask.cance
```

The lesson must anticipate this mistake before the cancellation step. Explain:

- `processingTask` represents and tracks the operation.
- A Task does not own this cancellation request and has no `Cancel()` method.
- `cancellationSource` owns the request, so the caller invokes `cancellationSource.Cancel()`.
- `cancellationToken` carries that request to `ProcessReportAsync` and then `Task.Delay`.
- `Task.Delay` observes the request, after which the Task transitions to the canceled state.

Use this memory anchor:

> Cancel the source. Await the Task.

Add or improve a cancellation-flow visual if necessary so it shows these distinct responsibilities rather than presenting them as interchangeable objects.

## Purpose reminders

Keep the existing purpose checkpoints unnumbered. Update the checkpoints around Task creation, cancellation, and awaiting so they reinforce:

- The method has already started when its Task is stored.
- The source requests cancellation.
- The token transports the request.
- The observing API cooperates.
- Await reports the resulting Task state to the caller.

Do not add mechanical steps merely to repeat these reminders.

## Consistency requirements

Synchronize all affected representations:

- Session 28B lesson JSON
- Generated lesson page
- Standalone lab page
- Quiz page if quiz wording needs correction
- Learner-feedback/design notes
- Generator or validator support only when genuinely necessary

Keep Session 28B's Notes, Bookmark, and Shortcuts controls working. Verify the alphanumeric `session-28B` route initializes the runtime widgets rather than merely loading their script files.

## Validation

1. Confirm Session 28B still contains exactly 14 numbered steps.
2. Confirm purpose checkpoints remain unnumbered.
3. Confirm visible C# instruction blocks contain paste-ready comments and do not expose the complete solution.
4. Confirm the lesson distinguishes a using declaration from a using block before requiring the syntax.
5. Confirm the lesson states that method invocation starts the async method and awaiting observes its Task.
6. Confirm the lesson directs cancellation to `CancellationTokenSource`, not Task.
7. Confirm the three memory anchors are present where useful:
   - `Source requests. Token carries. Code cooperates.`
   - `The call starts the work. The Task tracks the work. Await observes the work.`
   - `Cancel the source. Await the Task.`
8. Regenerate and validate the complete site.
9. Confirm Notes and Bookmark initialize on Session 28B.
10. Confirm no learner implementation or production code changed.

Do not push unless explicitly requested.

## Final report

Report:

- Exact lesson corrections
- Exact files changed
- Step count and purpose-checkpoint count
- How using declaration versus using block is now taught
- How async invocation versus await is now taught
- How cancellation ownership is now taught
- Site generation and validation results
- Widget verification result
- Confirmation that learner and production code were unchanged
