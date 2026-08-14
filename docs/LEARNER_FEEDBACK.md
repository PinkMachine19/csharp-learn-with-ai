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

## Session 29 — Test naming, type spelling, dates, and test runners

### Type meaningful test names instead of copying them

The learner found that typing a descriptive test name helps the test's behavior and naming convention sink in. When a test first uses the established naming pattern, encourage the learner to type the important name rather than pasting a completed declaration:

`MethodUnderTest_WhenCondition_ExpectedResult`

For example, typing `CalculateTotalHours_WhenCompletedEntriesExist_ReturnsTheirTotal` reinforces which method is under test, the scenario being arranged, and the expected outcome. Keep the visible instructions paste-ready as comments, but let those comments direct the learner to type the declaration themselves.

### Explicit local types versus var

The learner prefers explicit local types such as `ClockEntryRepository repository = new();` and `PayrollService service = new(repository);`. Treat this as valid C# rather than steering every example toward `var`.

- Both explicit types and `var` produce statically typed local variables.
- `var` asks the compiler to infer the compile-time type; it is not dynamic typing.
- Use `var` when the type is obvious from the right side and repeating it adds little.
- Spell out the type when seeing it helps the reader understand the code or the contract.
- Target-typed `new` can keep an explicit-type declaration concise.

Use the practical rule: “Use `var` when the type is obvious and unimportant. Spell out the type when seeing it helps the reader.”

### DateTime constructor argument order

The learner twice reversed the arguments to the `DateTime` constructor while trying to represent August 14, 2026. Show the constructor shape near the first fixed-date instruction:

```csharp
DateTime(int year, int month, int day)
```

Then ask the learner to substitute the intended year, month, and day. This prevents a distracting out-of-range failure while still requiring the learner to type the actual test data.

### IDE test runners and command-line verification

The learner reasonably asked whether developers really type the long filtered `dotnet test` command instead of using VS Code. Explain both workflows without treating either as less professional:

- VS Code's Testing panel, Visual Studio Test Explorer, Rider, and keyboard shortcuts are normal for everyday focused test runs.
- CLI commands are editor-independent, repeatable, precise about project/configuration/filter, and suitable for continuous integration.
- Developers commonly reuse long commands through terminal history, editor tasks, or scripts rather than retyping them.
- In the lab, the explicit command teaches exactly what is executed; the learner may use the IDE test runner for the focused run if the same two tests are selected and reviewed.

## Session 30 and 30B — Separate test doubles from DI lifetimes

The earlier Session 30 title promised test doubles, Moq, service tests, and DI lifetimes, but its actual lab only contained a compressed ScratchPad lifetime experiment. These are related through dependency injection, but they require different practice and should not compete inside one 40-minute lesson.

- Session 30 now teaches unit isolation through the learner's real `ClockEntryService` and `IClockEntryRepository` boundary.
- Its first lab builds a small recording fake so the learner sees that a test double is ordinary C# implementing a real contract.
- Its second lab tests the same behavior with Moq so `Setup`, `Object`, `It.Is`, `Verify`, and `Times.Once` can be compared fairly with the fake's recorded state.
- Moq is not described as merely a clarity shortcut. It is useful for controlled collaborator responses and precise interaction verification, while still requiring deliberate test design.
- Session 30B is a primary cumulative lesson, not an optional side lab. It owns `IServiceCollection`, the composition root, transient/scoped/singleton rules, scopes, disposal, mutable-state implications, and `ReferenceEquals` observations.

Keep the memory distinction: constructor injection lets a caller provide dependencies; a DI container automates construction and lifetime rules. Constructor injection does not require a container.

### Session 30 observed misunderstanding: nested test-helper placement

The instruction “Inside the test class, add private sealed class RecordingClockEntryRepository” did not make the brace placement concrete enough. The learner reasonably created `RecordingClockEntryRepository` as a separate public top-level class after the closing brace of `ClockEntryServiceTests`.

When a lesson first requests a nested test helper, explicitly state:

- Place the helper after the test methods but before the final closing brace of the containing test class.
- The helper's opening and closing braces must remain inside the containing class's braces.
- `private` means only the containing test class can name the helper.
- `sealed` means the focused fake is not designed for inheritance.
- Nesting keeps a test-only implementation beside the tests that use it and prevents it from appearing as a reusable production or test-project API.

Show a brace-only grammatical shape without exposing the completed helper implementation:

```csharp
public sealed class ExampleTests
{
    // Test methods remain here.

    private sealed class ExampleFake
    {
        // Fake members remain here.
    }
}
```

Do not assume that “inside the class” unambiguously communicates nested-type syntax to a learner who has primarily created top-level classes.

### Session 30 learner feedback: inline comprehension pauses

The recording-fake lab introduced the interface implementation, nested helper class, configurable return state, recorded call state, access modifiers, and test arrangement close together. The learner could mechanically type the syntax but felt unable to explain the complete construction. A large explanation or end-of-lab quiz would add more load at that moment.

Add brief, low-pressure comprehension pauses directly between appropriate lab steps. Each pause should ask one small question about the purpose of the code already typed, accept an ordinary-language answer, and resolve that question before continuing. Do not require formal terminology or ask several questions at once.

For the Session 30 recording-fake lab, include checkpoints equivalent to:

1. Which object is the test actually testing: `ClockEntryService` or `RecordingClockEntryRepository`?
2. When the service tries to save an entry, which object records that call for the test to inspect?
3. After arranging the objects, what repository situation is the test controlling?

Reinforce the compact mental model: “We test the service; the recording fake observes what the service does.” Apply this pattern to future labs whenever a step combines multiple new syntax or conceptual roles. These pauses supplement the formal quizzes; they are not scored gates.

### Future optional side lab: prove the value of an interaction test with a regression

The learner understood what the recording fake stored but could not yet feel why that evidence mattered because the current implementation was visibly calling the repository. Add a short optional, disposable side lab that demonstrates a believable real-world regression and lets the learner watch the test detect it.

The side lab should:

- Start with a tiny service, repository boundary, and passing test in an isolated exercise project rather than modifying permanent TimeClock production code.
- First verify only the returned success value, then introduce a plausible developer mistake where the service still returns success but no longer requests the save.
- Run the incomplete test and observe that it passes despite the defect.
- Add recording or interaction evidence, rerun, and observe the failure that identifies the missing save.
- Restore the correct service behavior and rerun to green.
- Explain the practical distinction: reading the implementation describes what it appears to do now; a regression test repeatedly checks that the promised behavior survives later edits.
- Use ordinary language such as “the fake keeps a receipt” before introducing formal interaction-testing terminology.

The lesson's central question should be: “Could this test still pass if the service claimed success but forgot to save?” Keep the exercise small enough that the learner experiences the red/green contrast rather than receiving another abstract testing explanation.

### Optional tooling lab feedback: manually type and read common .NET CLI commands

The learner commonly copies long `dotnet` commands to keep moving but wants deliberate practice typing the everyday commands manually. Audit the existing VS Code Fluency side lab before creating another module. Prefer extending that optional tooling material, or create a distinct CLI side lab only if the existing lab cannot hold the topic cleanly.

The exercise should use a disposable project and cover a small practical command vocabulary, including `dotnet build`, `dotnet test`, `dotnet run`, `dotnet add ... package`, and `dotnet list ... package`. Teach each command as a readable sentence: executable, verb, project path, and options. Include short manual-typing repetitions, path completion from the terminal, command history, and a reminder to inspect a command before pressing Enter. Do not turn it into shell memorization or require long project paths to be retyped repeatedly after the command shape is understood.

Distinguish learning practice from normal professional workflow: manually typing common command shapes can build fluency, while copy/paste, shell history, IDE test controls, and task shortcuts remain legitimate everyday tools. Keep this optional and separate from the testing concept being learned in Session 30.

### Future optional side lab: how fluent library APIs are built

While first using Moq, the learner recognized that `Setup(...).Returns(...)` is deliberately shaped to read like a small sentence and wanted to understand how library authors create APIs like this. Record this as a potential advanced side lab rather than expanding the current testing lesson.

Use a tiny library designed within the exercise—do not attempt to recreate Moq. Build the idea progressively from an ordinary method call to a method returning a configuration object, then chain a second method from that returned object. Connect the visible syntax to generic types, lambda parameters, delegates, and fluent method chaining. Only introduce expression trees after delegates and lambdas have already been established, and clearly distinguish instance methods from extension methods: a fluent chain does not automatically imply that every method in it is an extension method.

The lab should answer the learner's practical question: “How did the library author make this code possible?” It should trace compile-time types through one short chain and let the learner implement a miniature `Choose(...).Returns(...)` API in a disposable project. Keep Moq internals illustrative rather than claiming to reproduce or exhaustively explain its implementation.

### Course-wide feedback: orient the learner before first-use library syntax

When a lab first introduces an external library or a compact domain-specific API such as Moq, do not move directly from a conceptual paragraph to instructions that assume the learner can author the library's grammar. Anticipate the learner's likely “What is this?” questions at the point of first use.

Before each new expression shape, briefly identify:

- what object the learner currently has;
- whether the line configures behavior, runs production behavior, or checks evidence;
- who will invoke the described call later;
- the type or role returned by one fluent method so the next chained method is possible;
- which syntax is ordinary C# and which names come from the library;
- what the complete line means in one ordinary-language sentence.

Show genuinely new third-party syntax on first use; do not ask the learner to guess it from prose or discover it through IntelliSense. Follow the reveal with a tiny recognition question or a small value change so the learner still participates. Reuse the compact explanation on subsequent steps instead of repeating a large theory section. Apply this pattern to future labs, especially mocking, dependency injection, serialization, database, HTTP, and assertion libraries.

### Session 30 learner feedback: explain Moq's entire purpose before Setup and Verify

Before presenting any Moq grammar, state why the learner is repeating the recording-fake test with a library. Use the direct comparison: the hand-written fake supplies an answer and exposes its receipt through properties; Moq creates the substitute and keeps the receipt internally, `Setup` supplies the answer, and `Verify` inspects the receipt. Make clear that Moq is optional rather than automatically superior. It becomes useful when manually maintaining several fake methods, configured responses, or recorded interactions would obscure the test.

The learner should encounter this three-part story before syntax:

1. `Setup`: tell the substitute what answer to give when the service asks a question.
2. Act: call the real service once.
3. `Verify`: inspect Moq's recorded calls and require the expected interaction.

Explicitly say that `Verify` does not call `SaveClockEntry` again. It searches the call history created when the production service ran. Explain `It.Is<ClockEntry>` primarily as an argument-condition matcher: the method contract already requires a `ClockEntry`; the predicate checks that its employee ID and clock-in time are the expected values.

### Session 30 learner feedback: separate test discovery from VS Code's display

The completed `[Fact]` tests built successfully and were discoverable through `dotnet test --list-tests`, but the new test did not immediately appear in VS Code's Testing panel. The lesson's validation step should explain that these are separate layers. If command-line discovery lists the test, do not rewrite a valid test merely because the editor view is stale.

Provide a short troubleshooting order:

1. Confirm VS Code is connected to the intended WSL environment and has the learner repository root open.
2. Refresh the Testing panel or run `Test: Refresh Tests` from the Command Palette.
3. If necessary, run `Developer: Reload Window` and reopen Testing.
4. Use `dotnet test --list-tests` to distinguish assembly discovery from an editor-cache problem.

Keep this troubleshooting collapsed or adjacent to the run step so it is available when needed without burdening every learner before a problem occurs.

### Session 30B learner feedback: create marker types before registering them

The lesson asked the learner to register `TransientMarker`, `ScopedMarker`, and `SingletonMarker` before those types existed. The resulting “type could not be found” errors made the learner reasonably wonder whether a namespace was missing. Future DI labs should create new service or marker types before registration code references them, unless diagnosing an unresolved type is itself the stated objective.

Explain why the Session 30B marker classes are intentionally empty: they are distinct object types used only to isolate and observe reference identity. Their behavior is held constant so the registered lifetime is the only variable. Use the memory anchor: “Blank marker; visible identity.” After the types compile, register them and explain the generic registration grammar.

### Session 30B learner feedback: refresh the generic Resolve helper

Repository evidence shows the learner previously wrote `private static T SelectGreater<T>(...) where T : IComparable<T>` in Sessions 14 and 15. Therefore, a separate prerequisite side lab is not necessary solely for the Session 30B `Resolve<T>` helper. However, Session 30B combines that older grammar with two unfamiliar details: the new `notnull` constraint and a generic third-party call to `GetRequiredService<T>()`.

Before asking the learner to compose the helper, provide a compact retrieval refresher that reads `private static T Resolve<T>(IServiceScope scope) where T : notnull` from left to right. Explicitly substitute one concrete call, such as `Resolve<TransientMarker>(firstScope)`, to show that every `T` becomes `TransientMarker`. Explain that `static` is appropriate because the helper uses only its parameter and no `LifetimeExperiments` instance state. Then introduce `notnull` as the new part and explain how it matches the required-service contract. This should be an inline refresher, not a new side lab, unless broader future feedback reveals that generic method fundamentals were not retained.

### Session 30B learner feedback: separate setup typing from prediction work

The learner understood the three lifetime rules but became bored while typing nearly identical resolution and `ReferenceEquals` blocks. Repetition had stopped producing retrieval and became copy/paste work merely to finish. In lifetime labs, label package setup, provider/scope construction, and repeated output formatting as pasteable setup once their role is understood. Retain one complete learner-authored comparison, then use partial scaffolds whose meaningful blanks require choosing the marker type, scope boundary, or expected identity.

The active task should be committing to a prediction before resolution and reconciling the observed Boolean afterward. Do not equate understanding with retyping unchanged declarations. Use the anchors: “Transient: new every request,” “Scoped: one per scope,” and “Singleton: one per provider.”

### Session 30B learner feedback: package CLI and disposal ownership

Offer the established `dotnet add ... package` command as a first-class workflow and explain that it edits the project file and restores the package. Manual `PackageReference` editing remains a valid alternative, not the only professional route.

When creating `ServiceProvider` and `IServiceScope`, explain how the learner can discover disposal requirements: hover the type, use Go to Definition, look for `IDisposable` or `IAsyncDisposable`, and consult API ownership documentation. Use the ownership anchor: “I created it, it is disposable, so I probably own its disposal—unless the API says otherwise.” State that using declarations dispose in reverse declaration order: second scope, first scope, then provider.

### Course-wide learner feedback: add a compact practice-drills section

The learner does not want to repeat a complete lesson merely to strengthen syntax recall. Design a dedicated optional, non-prerequisite **Drills** section for the entire course, organized by session and concept. Session 30B is one concrete example, not the limit of the feature. Each completed session should be able to contribute several tiny retrieval exercises rather than another guided implementation.

Include drills such as:

- Reconstruct `private static T Resolve<T>(IServiceScope scope) where T : notnull` from a plain-English description.
- Label the return type, method type parameter, ordinary parameter, and constraint.
- Substitute `TransientMarker` for every `T` in one concrete call.
- Write one transient, scoped, and singleton registration from memory.
- Predict identity results for repeated resolutions within one scope and across two scopes.
- Identify which disposable object owns each scope and state the reverse disposal order.
- Correct deliberately broken examples, such as resolving through the wrong object or scope, choosing the wrong lifetime, missing generic brackets, or using a type before declaring it.

Keep each drill independently repeatable in roughly one to three minutes. Provide answers behind Reveal and label the drills section as optional retrieval practice, not a new cumulative session and not a prerequisite. Its purpose is to build fluency across all completed labs without asking the learner to redo a 40-minute lesson. Add navigation and indexing that let the learner filter or jump by session, layer, and concept when this feature is implemented. Do not create the full drills section during an unrelated lesson correction; preserve this note as a future course-wide design task.
