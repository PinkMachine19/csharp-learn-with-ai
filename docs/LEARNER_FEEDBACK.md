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

## Planned cumulative Session 28B — Cooperative cancellation

Session 28B is under consideration as a real cumulative lesson immediately after Session 28, not an optional side lab. It should continue from the learner's completed Session 28 ScratchPad state, create its own distinct Session 28B experiment, and teach cooperative cancellation without changing production TimeClock code. If adopted, update the primary manifest, navigation, prerequisites, generated lesson/lab/quiz pages, and downstream session links so Session 29 follows Session 28B. The lesson must not be represented as optional or safe-to-skip if later cumulative sessions are allowed to assume its concepts.
