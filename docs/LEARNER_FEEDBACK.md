# Learner Feedback and Course-Design Notes

## Session 27 — Generic type inference and IntelliSense

The learner understands that type inference allows the compiler to determine omitted generic types, but the process can feel mysterious when reading long IntelliSense signatures. Future lessons should explain the concrete evidence used to infer each type.

For the Session 27 `Task.WhenAll` call:

- `firstTask` is `Task<string>`.
- `secondTask` is `Task<string>`.
- `Task.WhenAll` receives those `Task<string>` arguments.
- `TResult` therefore becomes `string`.
- Awaiting the combined result produces `string[]`.

Use the reminder: “Type inference hides repeated type spelling; it does not remove type safety.” Explain that the C# language service performs compiler-like analysis for IntelliSense, while the build compiler remains authoritative.

A separate optional side lab about compiler type inference, generic method signatures, and IntelliSense signature reading is under consideration. Do not create it or make it a prerequisite yet. Possible future topics include `var` and actual compile-time types, argument-driven generic inference, return-context inference, overload lists, and reading `Task.WhenAll<TResult>(params Task<TResult>[] tasks)`.

## Temporary implementation guidance

Avoid unnecessary warnings and red squiggles while a learner builds a method incrementally. Before a method needs `await`, omit `async` and return `Task.CompletedTask` or `Task.FromResult`. When the learner adds the first awaited operation, explicitly convert the method to `async` and return the underlying result value. `Task.FromResult` is a static method call; it is not constructed with `new`.

### Session 28 observed misunderstanding

The learner initially combined `async Task RunAsync()` with `return Task.CompletedTask;`. Explain why these belong to different stages. A non-async method declared as returning `Task` must explicitly return a Task object, so `Task.CompletedTask` is a warning-free temporary implementation. After `async` and `await` are introduced, an `async Task` method must not explicitly return a Task object; the compiler creates and completes the returned Task. Contrast this with `void`, which provides no completion handle to its caller.

The learner also wrote `await failureTask()` after storing the result of `FailAfterDelayAsync()`. Reinforce the grammar distinction: parentheses invoke a method, while `failureTask` is a variable referring to the Task object returned by the earlier method call. The method is called once with `FailAfterDelayAsync()`; the stored operation is later observed with `await failureTask` and no parentheses.

The phrase “Do not discard the returned Task” led the learner to write `var result = await asyncFailureExperiments.RunAsync()`. Clarify that awaiting a `Task` is already observing rather than discarding it. Awaiting `Task` produces completion but no assignable value; awaiting `Task<T>` produces a value of type `T`. Explicit discard is `_ = RunAsync()`, while a bare unawaited call also gives up deliberate completion control.

The learner reasonably expected cancellation because the visible lesson title said “Cancellation and Asynchronous Exceptions.” The corrected primary Session 28 intentionally teaches only faulted Tasks and awaited exception observation. Cooperative cancellation is a separate concept requiring `CancellationTokenSource`, token propagation, an observing API, and `OperationCanceledException`; adding it here would overload the focused failure-observation lab. Rename visible Session 28 metadata/headings so they do not promise cancellation. Keep cancellation available in the independent async refresher and introduce it in the cumulative path only at genuine external I/O boundaries.

The learner reported losing the purpose of the exercise after typing through several steps. Apply a forward-looking rule to all newly authored or corrected labs: insert short purpose checkpoints after natural groups of mechanical steps and before integration, running, and final validation. Do not retroactively rewrite every earlier session solely for this note.

## Adopted cumulative Session 28B — Cooperative cancellation

Session 28B is a real cumulative lesson immediately after Session 28, not an optional side lab. It continues from the learner's completed Session 28 ScratchPad state, creates its own distinct Session 28B experiment, and teaches cooperative cancellation without changing production TimeClock code. The primary manifest, navigation, prerequisites, generated lesson/lab/quiz pages, and downstream session links place Session 29 after Session 28B. The lesson is not represented as optional or safe to skip.

The lab uses unnumbered purpose checkpoints after short groups of mechanical steps and before integration, running, and final validation. It preserves warning-free temporary `Task.CompletedTask` methods until each method first needs `await`, and reinforces method-call parentheses, stored Tasks, and the difference between awaiting `Task` and `Task<T>`.

### Session 28B observed misunderstanding: using declarations and disposal

The learner naturally wrote a traditional `using` block because the lesson requested a `using` declaration without first teaching that syntax. Future lessons must explicitly distinguish the two valid forms before asking the learner to choose one:

- A `using` block disposes the object when execution leaves that block and adds a nested scope.
- A `using` declaration, such as `using CancellationTokenSource cancellationSource = new();`, has no extra braces and disposes the object when execution leaves the current containing scope.
- A normal local-variable declaration is not automatically disposed merely because the method ends or the variable goes out of scope. Garbage collection and deterministic `Dispose` calls are different mechanisms.
- `CancellationTokenSource` implements `IDisposable`. Even though this ScratchPad example is not a database connection, disposing the source releases resources it may own. Teach the general ownership rule without exaggerating the cost of this tiny experiment.

When a lab first introduces a `using` declaration, show its grammatical shape, name the end of its disposal scope, and contrast it briefly with the already-familiar `using (...) { }` block. Do not assume the newer declaration syntax is known.

### Session 28B observed misunderstanding: calling versus awaiting async work

After storing `Task processingTask = ProcessReportAsync(cancellationToken);`, the learner asked whether the operation waits to start until `await processingTask`. Future async lessons must state the timeline explicitly:

- Calling `ProcessReportAsync(...)` invokes the method immediately. It runs synchronously until it reaches an incomplete awaited operation, then returns a Task representing the remaining work.
- Assigning that returned Task to `processingTask` preserves the caller's handle; assignment does not delay or start the operation.
- `await processingTask` does not start the method. It waits for and observes the already-started Task's completion, cancellation, or failure.

Use the memory anchor: “The call starts the work. The Task tracks the work. Await observes the work.” Add this reminder at the first lab step that separates Task creation from its later await.

### Session 28B observed misunderstanding: cancellation ownership

The learner tried to cancel `processingTask`. Teach the responsibility split before the cancellation step:

- A Task represents and tracks an operation; it does not own this cancellation request and has no `Cancel()` method.
- `cancellationSource` owns the request, so the caller invokes `cancellationSource.Cancel()`.
- `cancellationToken` transports the request through the helper to `Task.Delay`.
- The observing API cooperates, after which the Task transitions to the canceled state and `await` reports that state to the caller.

Use the memory anchors: “Source requests. Token carries. Code cooperates.” and “Cancel the source. Await the Task.”
