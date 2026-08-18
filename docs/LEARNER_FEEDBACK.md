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

## Session 31 learner feedback: explain every added dependency

The Session 31 lab asks the learner to add a Domain project reference and three NuGet packages without explaining what each dependency contributes. Before showing installation commands, future corrections must identify why Infrastructure needs each item:

- The Domain project reference lets Infrastructure implement Domain repository contracts and map persistence entities to and from Domain objects.
- `Microsoft.EntityFrameworkCore.Sqlite` supplies EF Core's `DbContext` APIs, SQLite provider, relational behavior, and async database operations used by this lesson.
- `Microsoft.Extensions.DependencyInjection.Abstractions` supplies DI contracts and registration abstractions without requiring the full container implementation where only abstractions are needed.
- `SQLitePCLRaw.bundle_e_sqlite3` supplies the native SQLite bundle selected by the repository; explain why the pinned patched version is required rather than making the learner treat the package name as magic.

Offer the corresponding `dotnet add reference` and `dotnet add package` commands as the normal CLI workflow. Do not reduce dependency setup to unexplained project-file edits or unexplained commands. After installation, briefly distinguish a project reference from a NuGet package reference and tell the learner which later type or method will prove that each dependency is actually being used.

### Session 31 learner feedback: make long CLI commands readable

The repeated full project paths in several `dotnet add` commands made the actual operation difficult to see. When a Bash/WSL lab repeats long paths or a pinned version, define descriptive task-specific variables first, quote every expansion, and then show short commands using those variables. For example, define `infrastructure_project`, `domain_project`, and `package_version` rather than repeating the paths and version four times.

Explain that these are shell variables used only to improve command readability; they do not change the `.csproj` syntax or become C# variables. Keep each installation command on its own line so failures remain attributable to one dependency. Avoid opaque one-letter variables and do not use broad system variable names.

Present this pattern directly in the visible lab instructions, not only in a concept sidebar. Immediately before or after each command, add one short TTS-friendly sentence explaining what that specific reference or package enables in the upcoming code. Keep the explanation brief enough that the command sequence remains scannable.

### Session 31 learner feedback: explain contract folder ownership

The learner initially created `IAsyncClockEntryRepository` under Infrastructure and then reasonably asked why it should not live in a generic Domain `Interfaces` folder. The corrected lesson must explain both the architectural boundary and the repository's existing organization convention before naming the path.

- Domain owns the persistence-agnostic contract; Infrastructure implements that contract with EF Core.
- The existing synchronous `IClockEntryRepository` already lives in `Domain/Repositories`, so the async repository contract belongs beside it.
- This repository organizes contracts by responsibility (`Repositories`, `Services`, and similar capability folders) rather than placing every interface in one technical-kind `Interfaces` folder.
- An `Interfaces` folder would be valid in another codebase, but introducing it here would create a second convention during an unrelated EF lesson.
- Because the learner project currently uses global namespaces, the folder location organizes source but does not automatically create or change a C# namespace.

Use the memory anchor: “Domain owns the promise; Infrastructure fulfills it.” State the reason before instructing the learner to create the file so the path is an architectural decision rather than unexplained ceremony.

### Course-wide learner feedback: refresh older definitions at the point of reuse

The learner frequently encounters important earlier terms, such as “invariant,” many sessions after their original introduction. Future labs should occasionally provide a one-sentence retrieval reminder exactly where an older concept becomes relevant again rather than assuming the vocabulary remains immediately available.

For example, when Session 31 separates `ClockEntry` from `ClockEntryEntity`, remind the learner: “An invariant is a rule that must remain true for a valid domain object.” Connect the definition to the current action: Domain constructors and methods protect those rules, while an EF persistence entity primarily represents stored columns.

Apply this selectively across future labs for terms such as invariant, contract, composition root, materialization, deferred execution, object identity, and ownership. Keep reminders short, concrete, and tied to the current step. Do not repeat entire earlier lessons or interrupt every familiar term with a glossary entry.

### Session 31 learner feedback: explain the C# and EF grammar before DbContext composition

The `TimeClockDbContext` step introduced several layers at once: a derived class, a generic options type, a base-constructor initializer, an expression-bodied `DbSet` property, and EF Core change tracking. The learner could type the completed shape but could not yet explain what those pieces meant, creating cognitive overload.

Correct the step using just-in-time explanation before asking for composition:

- Explain that `: DbContext` is inheritance: `TimeClockDbContext` derives from EF Core's `DbContext`.
- Explain that `: base(options)` is a C# constructor initializer. It invokes the base-class constructor before the derived constructor body runs and passes along the same `options` object.
- State what the options contain in this lesson: the selected database provider, the SQLite connection or connection string, and other EF Core behavior configured by the caller. They are not domain data, employee addresses, or stored clock-entry rows.
- Explain that `DbSet<ClockEntryEntity>` is EF Core's query-and-save entry point for rows represented by `ClockEntryEntity`; it is not simply a `List<T>` held by the property.
- Explain that `Set<ClockEntryEntity>()` asks this context for its managed `DbSet` for that entity type.
- Define tracking: while the context is alive, EF Core records entity instances and their states, such as `Added`, `Unchanged`, `Modified`, or `Deleted`, so `SaveChanges` knows which SQL operations to send.
- Clarify that a `DbSet` does not mean all rows are already loaded in memory. A query is translated and executed through the configured provider when the query is materialized; individual returned or added entities may then be tracked in memory by the context.

Teach each layer with a tiny grammar example or labeled signature before combining them. Avoid relying on completed code plus a dense list of new definitions. Use occasional comprehension pauses such as: “Who creates the options?”, “Which constructor receives them next?”, and “Has a database query run merely because the DbSet property was accessed?”

Use layered placement rather than putting all depth before or after the lab:

1. **Before the lab:** give only the small boundary map and vocabulary needed to understand the goal.
2. **Immediately before an unfamiliar line:** provide the minimum just-in-time grammar and framework explanation required to write it deliberately.
3. **Immediately after that small code cluster:** provide a collapsed “Why this works” or “Deeper understanding” section covering mechanics, lifecycle, and common misconceptions.
4. **At the purpose checkpoint:** ask one short comprehension question that reconnects the mechanics to the objective.
5. **In the optional reference/drills area:** preserve searchable definitions and retrieval practice for later recovery.

Do not place essential understanding only after the entire lab, because the learner would type unexplained code first. Do not front-load every deep detail before coding, because the learner has no concrete code to attach it to. Essential meaning belongs just in time; deeper mechanics belong adjacent and collapsible.

Use a consistent, approachable title for the adjacent collapsed section, such as **“What you should be asking right now”**. Inside it, phrase two or three likely learner questions conversationally—for example: “What configuration is actually inside `options`?”, “Did accessing this `DbSet` load the table into memory?”, and “Who is tracking these objects?” Answer each directly and briefly. The slightly playful title should normalize asking foundational questions rather than implying the learner should already know the framework's hidden mechanics.

Apply the learner's placement rule: corrections necessary to understand the active lab belong in `docs/LEARNER_FEEDBACK.md`; broader tooling, glossary, or future-module ideas belong in `docs/SECONDARY_TERTIARY_THOUGHTS.md`.

## Session 32 learner feedback: comment-first scaffolding for unfamiliar signatures

When a lab asks the learner to write an unfamiliar method signature, first provide a pasteable comment block that describes the signature in ordinary language. Name the access modifier, other modifiers such as `static`, return type, method name, parameters, and temporary return behavior. Then ask the learner to type the actual C# beneath those comments.

Do not require pure recall before the learner has had enough practice with that grammatical shape. The comment scaffold should guide construction without revealing the completed implementation. After the learner types the method, let them compare it with a code example only if they are stuck or want verification. Gradually shorten or remove the scaffold when the same syntax becomes established retrieval practice.

For Session 32's first query method, the scaffold should direct the learner to create a public static `CompletedForEmployee` method, return `IQueryable<ClockEntryEntity>`, accept a `TimeClockDbContext` and employee ID, and temporarily return the context's `ClockEntries` query. The filtering logic remains a later learner-authored step.

## Session 33 live-lab pacing and automatic feedback capture

During guided labs, always announce the current position as **Step n/n** and state how many numbered steps remain. Present one numbered step as one complete unit. Do not split a step into hidden parts or later announce additional required work under the same number; if the action is too large, increase the official step count and update every denominator before guidance begins.

Capture learner questions and observed friction proactively in the appropriate course feedback document when they reveal a reusable lesson improvement. The learner should not need to repeatedly say “make a Codex note.” Record direct active-lab corrections in `docs/LEARNER_FEEDBACK.md` and broader optional or future ideas in `docs/SECONDARY_TERTIARY_THOUGHTS.md`. Do not interrupt every interaction to narrate routine note-taking, and do not treat ordinary typos as curriculum defects unless the instructions contributed to them.

### Session 33 readable shell variables: separate the project-family prefix

When shell commands repeatedly use the long project-family name `PinkMachine19.TimeClock`, define it once as a descriptive variable such as `project_prefix`. Build the specific project name, directory, and project-file path from that value. This keeps the meaningful changing portion, such as `Web`, visible and avoids asking the learner to reread or retype the same long prefix.

Prefer a progression such as `project_prefix` → `web_project_name` → `web_directory` → `web_project_file`. Briefly explain that variable values may be composed from earlier variables and that braces in `${project_prefix}` clearly mark where a variable name ends before appending `.Web`. Do not over-fragment one-off short values into variables; apply this when repetition genuinely obscures the command.

### Session 33 project creation should use the .NET template command

The first Web-project step instructed the learner to create a directory, touch a `.csproj`, and paste routine SDK XML even though the .NET SDK provides the normal `dotnet new web` workflow. Prefer the official template command for this production project and explain what it creates: the Web SDK project file, a minimal `Program.cs`, framework settings, and restore-ready project structure.

After creation, use explicit `dotnet add ... reference ...` commands for the Domain and Infrastructure project references. Explain what each reference enables. This makes the resulting project-file changes inspectable without treating hand-authored boilerplate as the learning objective. Tell the learner that the generated minimal `Program.cs` is expected and will be deliberately replaced or extended at the later composition-root step.

Only fall back to manual `.csproj` creation when exact non-template structure is itself the lesson or the installed SDK lacks the required template. Before running a template into an existing directory, inspect it and avoid `--force` when it could overwrite learner work.

### Session 33 must acknowledge the Web folder scaffolded earlier

The learner correctly remembered creating the Web area during the original solution scaffolding. Repository inspection shows that `src/PinkMachine19.TimeClock.Web` already contains planned subfolders and `.gitkeep` placeholders such as `Requests`, `Responses`, `Configuration`, `Dtos`, `Mappings`, `Options`, and `Validators`, but it was not yet a buildable .NET project: before Session 33 it had no Web `.csproj`, no `Program.cs`, and no solution entry.

Session 33 must state this distinction before project creation: the earlier course created the **Web project shell/folder structure**, while this session activates that shell as a real ASP.NET Core project. Do not say the Web area was “previously nonexistent,” and do not make the learner feel that remembered earlier work was imaginary. Inspect the actual directory first, preserve its existing placeholder folders, and run the template into it only with a safe command that does not erase those files.

Audit the original solution-scaffolding lesson and commands for the readable variable approach discovered here. Where the long `PinkMachine19.TimeClock` prefix or project paths repeat, consider defining `project_prefix` and deriving specific project names and paths. Preserve commands that are already clear; do not mechanically introduce variables when a value appears only once. Also make the early lesson explicit about which directories are merely architectural placeholders and which directories already contain buildable projects with `.csproj` files and solution entries.

The preferred curriculum decision is to delay creating a buildable Web project until the Web layer is actually unlocked, so learners do not carry unexplained ASP.NET Core files through earlier layers. However, do not pre-create a detailed empty Web directory tree unless the architecture-preview lesson explicitly labels it as a non-buildable placeholder and later lessons explicitly say they are activating that shell. The cleanest option is usually to create the directory and real project together at first use. If future structure is previewed early, keep the preview documentary rather than materializing unused folders that later look like a forgotten project.

The existing placeholder tree also omitted `Controllers` even though Session 33 needs that folder before several of the pre-created future-oriented folders. If the course retains early physical scaffolding, audit the planned tree against the first actual Web lesson and include only folders with a clear upcoming purpose, including `Controllers`. Better still, let the official ASP.NET Core project and its needed folders appear incrementally when their concepts are introduced rather than trying to predict the entire future structure with `.gitkeep` files.

The live Session 33 attempt also showed that `dotnet new web` created valid template files before reporting the malformed trailing `-- framework net10.0` arguments. When a retry warns that it will overwrite files, inspect their timestamps and contents before recommending `--force`. If the intended template files were already created correctly, continue from the existing project instead of overwriting or deleting it.

### Course-wide learner preference: CLI actions make structure causal

The learner prefers creating projects, references, solution membership, and files through readable command-line actions even when the same result could be reached through the VS Code Explorer. This is not merely a tooling preference: typing a command makes the relationship between intention and repository change explicit. For example, `dotnet new` creates a project, `dotnet add ... reference` creates a dependency, and `dotnet sln ... add` changes solution membership. Explorer primarily shows the resulting structure but can hide why it exists.

Favor concise, readable CLI commands for structural operations when the command has instructional value. Immediately state what repository state the command changes, then encourage a quick Explorer or file inspection afterward so the learner connects the action to its visible result. Use descriptive shell variables for repeated long paths. Do not turn this preference into command memorization, forbid normal IDE workflows, or use CLI ceremony for edits that are clearer inside the editor.

### Session 33 must justify records before using them as HTTP contracts

Before asking the learner to create `ClockInRequest` or `ClockEntryResponse` as a `record`, explain why a record fits this boundary instead of presenting `sealed record` as unexplained grammar.

- These types primarily carry a small group of named values across the HTTP boundary; they do not own changing business behavior.
- A positional record declares that data shape concisely and gives value-based equality, a useful default for data-carrier types and tests.
- The generated constructor and readable representation reduce boilerplate without making the object dynamically typed or unstructured.
- `sealed` communicates that this exact transport shape is not intended as a base type for an inheritance hierarchy.
- The request and response remain separate even when their current properties look similar because incoming and outgoing API contracts can evolve independently.

Also state the limits of the choice: records are not mandatory for every request or response, and a class is valid when the type needs different construction, mutability, framework-binding behavior, or substantial behavior. Do not imply that records automatically validate input, enforce Domain invariants, make data immutable in every form, or replace Domain entities. Keep the explanation adjacent to the first record step and reuse a short reminder for the response record.

### Session 33 must explain one short public contract per file

The learner reasonably questioned why a one-line positional record needs an entire file. Explain that C# does not require one type per file; this is a repository organization convention. A short declaration may still represent a complete public HTTP contract, and the compiler generates additional members from the positional-record syntax even though the source is concise.

Keeping `ClockInRequest` in `Requests/ClockInRequest.cs` makes the contract easy to locate, keeps the filename aligned with the public type, produces smaller focused diffs, and lets the request evolve without sharing an unrelated file. Contrast this with tiny private nested helpers or tightly coupled implementation-only types, which may reasonably share a file. Do not suggest that file count measures complexity or that every one-line type universally deserves its own file.

### Session 33 nested generic composition needs practice, not one dense line

The first controller action combines `Task<T>`, `ActionResult<T>`, a response record, a framework result conversion, and `Task.FromResult<T>` in one signature and temporary return. For a learner who has consumed generics more often than deliberately constructed nested generic types, this becomes symbol-heavy before the HTTP meaning is secure.

Teach the final return contract from the inside out:

1. `ClockEntryResponse` is the successful body shape.
2. `ActionResult<ClockEntryResponse>` means an HTTP action may produce that body or another HTTP result such as `BadRequest` or `Conflict`.
3. `Task<ActionResult<ClockEntryResponse>>` means that HTTP outcome becomes available asynchronously.

Do not require the learner to author the dense temporary line `Task.FromResult<ActionResult<ClockEntryResponse>>(BadRequest(...))` on first exposure. Either label it as pasteable framework scaffolding or split it into an explicitly typed temporary result followed by inferred `Task.FromResult(temporaryResult)`. When the genuine service await arrives, replace the temporary mechanism with an `async` method and direct action-result returns.

Add optional short drills for composing and decomposing generics across the course. Include exercises that start with a plain value type, wrap it in one generic, then wrap that result in another; substitute concrete types for `T`; read nested types from the inside out; and correct misplaced angle brackets. Include both consuming existing generic APIs and deliberately writing small generic types or methods, because repeated consumption alone can leave the construction grammar abstract. Keep each drill one to three minutes and do not make the learner repeat the entire lab.

### Session 33 should expose conversions before relying on inference

The learner finds target typing and generic inference counterproductive when a type relationship is new because the omitted type prevents the concept from registering. In the first `ActionResult<T>` exercise, show the concrete intermediate types explicitly before offering the concise production form:

- `BadRequest(...)` returns a `BadRequestObjectResult`; it does not contain or infer `ClockEntryResponse`.
- `ActionResult<ClockEntryResponse>` is the action's broader contract. It can hold either a successful `ClockEntryResponse` value or an `ActionResult` representing a non-success HTTP outcome.
- The framework-provided conversion is what lets a `BadRequestObjectResult` become the result side of `ActionResult<ClockEntryResponse>`.
- `Task.FromResult<ActionResult<ClockEntryResponse>>(...)` then creates an already-completed Task whose result type is that complete HTTP contract.

During first exposure, use explicitly typed intermediate variables or an explicit `ActionResult<ClockEntryResponse>` construction and explicit generic type arguments. Only afterward show the inferred shorter form and label exactly what the compiler omitted. Do not treat maximum concision as the default teaching form. Gradually introduce inference after the learner can reconstruct the complete type relationship from memory.

When the method becomes `async Task<ActionResult<ClockEntryResponse>>`, explicitly explain that each `return` expression is checked against the inner async result type, `ActionResult<ClockEntryResponse>`, not against `Task` directly. Expand `return BadRequest(...)` once as `BadRequestObjectResult` → `ActionResult<ClockEntryResponse>` through the framework's result-side conversion; then explain that the async method builder produces the outer Task. Emphasize that `ClockEntryResponse` describes the successful body path, while a failure result such as Bad Request legitimately has no `ClockEntryResponse` value.

### Session 33 must separate pasteable signatures from learner-authored behavior

During the service-call step, the guidance correctly identified the nested ASP.NET Core method signature as pasteable scaffolding but then exposed the entire completed method body. That removed the intended practice of constructing the meaningful control flow.

For framework-heavy actions, separate the two explicitly:

- **Pasteable framework shell:** attributes and an unfamiliar nested generic signature may be shown when their grammar is not the current retrieval target.
- **Learner-authored behavior:** provide pasteable C# comments describing validation, awaited service arguments, cancellation forwarding, Boolean decision, HTTP translation, and temporary fallback. Ask the learner to type that body beneath the comments.

Only reveal the completed body when the learner is stuck, asks to see it, or requests verification after attempting it. Do not confuse sparing the learner from unfamiliar framework boilerplate with completing the lesson's actual decision logic for them.

### Session 33 must distinguish the HTTP result from its message text

The learner correctly wrote a message containing the word “Conflict” but still called `BadRequest(...)`. Explain at the decision step that the controller helper method selects the HTTP status code, while the string only supplies explanatory response content:

- `BadRequest("...")` produces HTTP 400 regardless of the words in the message.
- `Conflict("...")` produces HTTP 409 regardless of whether the message contains the word “conflict.”

Ask the learner to choose the result method first based on protocol meaning, then write a useful human-readable message. Do not imply that ASP.NET Core interprets message text to select a status code.

### Session 33 should refresh string interpolation at the Created location

The `Created` step asks the learner to insert `request.EmployeeId` into a route string without reminding them of interpolation grammar. Add a brief just-in-time refresher before the instruction:

```csharp
string location = $"/items/{itemId}";
```

Explain that `$` enables interpolation and braces mark the C# expression whose value is inserted. Have the learner first create an explicitly typed `string location` variable, inspect the resulting route mentally, and then pass `location` plus the response object to `Created`. Only afterward show the more compact inline interpolation as an optional equivalent. This keeps route construction separate from the framework method call during first exposure.

### Session 33 DbContext registration should expose the inferred delegate

The concise registration `builder.Services.AddDbContext<TimeClockDbContext>(options => options.UseSqlite(...))` hides the lambda parameter type and the delegate contract at the exact moment both are new. During first exposure, expand it into an explicitly typed `Action<DbContextOptionsBuilder>` variable and an explicitly typed `DbContextOptionsBuilder` lambda parameter. Then pass that named delegate to the explicitly generic `AddDbContext<TimeClockDbContext>` call.

Explain the chain without attributing it to the IDE: the selected `AddDbContext` overload expects an `Action<DbContextOptionsBuilder>`, so the C# compiler can infer the untyped lambda parameter. The IDE uses language-service analysis to display that inferred information, but it does not define the rule. After the learner understands and can reconstruct the explicit form, show the inline inferred lambda as an optional conventional equivalent. Apply the learner's broader preference: expose new types first; compress later.

### Session 33 must explain registration-before-Build ordering

The learner placed `WebApplication app = builder.Build()` before `builder.Services.AddControllers()` and `AddDbContext(...)`. This compiles, so build validation alone does not reveal the lifecycle error. Explain before composition that `builder.Services` is the mutable service-registration collection, while `builder.Build()` creates the application and finalizes the service provider. Registrations must be completed before `Build`; attempting to modify the service collection afterward can fail when the application starts.

Use a visible phase sequence:

```text
create builder
→ register every service
→ build application
→ create startup scope / initialize database
→ map endpoints
→ run
```

Add a startup verification because this class of error is runtime-visible rather than necessarily compile-visible. Ask one short prediction question before the first run: “Can the container construct the controller and every dependency after Build?”

### Session 33 needs a purpose diagram before startup-scope boilerplate

The Program.cs step asks the learner to create a scope, resolve `TimeClockDbContext`, and call `EnsureCreatedAsync` without first diagramming the intention. Before showing this framework code, distinguish registration from resolution:

- `AddDbContext<TimeClockDbContext>(...)` registers a construction recipe and scoped lifetime; it does not create the context instance used at startup.
- `builder.Build()` creates the application service provider from all registered recipes.
- `app.Services.CreateScope()` creates a valid scoped-lifetime boundary outside an HTTP request.
- `scope.ServiceProvider.GetRequiredService<TimeClockDbContext>()` asks the container to construct one context according to the registered recipe.
- `dbContext.Database.EnsureCreatedAsync()` uses that actual context, provider, and connection to create the SQLite schema when it is absent.
- Disposing the scope disposes the scoped context after initialization.

Show the intent before syntax:

```text
register recipe
→ build provider
→ create startup scope
→ resolve actual DbContext
→ ensure database schema
→ dispose startup scope
→ begin serving requests
```

Also show the normal request-time graph separately:

```text
HTTP request scope
→ ClockEntriesController
→ AsyncClockEntryService
→ IAsyncClockEntryRepository / EfClockEntryRepository
→ TimeClockDbContext
→ SQLite
```

Explain that normal requests receive scoped services automatically, while startup database initialization has no request scope, so Program.cs creates one deliberately. Label this block as application startup initialization, not generic DI ceremony. Keep the diagram adjacent to the code and include a short purpose reminder after it.

### Session 33 must contrast AddControllers with MapControllers

The learner asked how to map controllers after already calling `AddControllers`. Explain that these methods participate in different startup phases:

- `builder.Services.AddControllers()` registers the services ASP.NET Core needs to create and execute controllers.
- `app.MapControllers()` reads controller route attributes and adds those routes to the application's endpoint table.
- `app.Run()` starts the host and must appear after endpoint mapping.

Use the memory anchor: “AddControllers prepares controller services; MapControllers exposes controller routes.” Connect the controller's `[Route("clock-entries")]` and `[HttpPost("clock-in")]` attributes to the resulting `POST /clock-entries/clock-in` endpoint.

### Session 33 final startup must explain the expected root 404

After replacing the generated `app.MapGet("/", ...)` route with controller mapping, browsing to the application root sends `GET /`, but Session 33 defines only `POST /clock-entries/clock-in`. A 404 at `/` therefore means no endpoint matches that method-and-path pair; it does not by itself mean startup or controller mapping failed.

At final validation, state the registered endpoint explicitly and distinguish both dimensions of routing:

```text
HTTP method: POST
Path: /clock-entries/clock-in
```

Provide a readable `curl` request using the actual listening base URL and JSON body. First use an invalid employee ID to verify the controller's Bad Request branch without requiring successful persistence, then optionally use a valid value to observe Created and a repeated open entry to observe Conflict. Explain that typing the URL into a browser address bar issues GET, so it cannot exercise a POST-only action. Do not reintroduce a root route solely to hide this expected 404 unless the course intentionally wants a health or landing endpoint.

### Session 33 must keep DbContext registration and provider configuration together

The learner registered `AddDbContext<TimeClockDbContext>()` but accidentally moved the `UseSqlite("Data Source=timeclock.db")` expression into a later comment. The project still compiled because registration without a configured provider is syntactically valid; the problem appears when the context performs database work at startup.

Keep the registration and provider configuration in the same visual code cluster. Immediately after it, ask: “Which provider and connection will this context use when resolved?” Validation must include starting the application or otherwise resolving the context and executing `EnsureCreatedAsync`; a successful build alone does not prove that an EF Core provider was configured.

### Session 33 startup scope must end before app.Run

A top-level using declaration such as `using IServiceScope scope = app.Services.CreateScope();` remains alive until control leaves the generated top-level method. Because `app.Run()` blocks until shutdown, that form keeps the startup scope and its `TimeClockDbContext` alive for the application's entire run.

Use a bounded `using (IServiceScope scope = app.Services.CreateScope()) { ... }` block around context resolution and `EnsureCreatedAsync`. Explain that leaving the braces disposes the context before routes are mapped and the server begins accepting requests. This makes the intended lifecycle visible:

```text
create startup scope
→ resolve context
→ ensure schema
→ leave block and dispose scope/context
→ map routes and run
```

Include this lifecycle in startup validation; do not present using declarations and using blocks as interchangeable when their containing scope ends at materially different times.

Before the startup-scope code, explicitly answer “What are we disposing, and what survives?” `TimeClockDbContext` is a short-lived unit-of-work object that owns tracking state and may own or coordinate database resources. The startup scope owns the scoped context instance it resolves. Disposing the scope disposes that context and releases its temporary resources. It does **not** delete the SQLite file, erase the schema, or undo `EnsureCreatedAsync`; `timeclock.db` and its created tables remain for later request scopes.

Connect the scope to the registered lifetime rather than presenting it as arbitrary nesting:

- `AddDbContext` registers `TimeClockDbContext` as scoped by default.
- During an HTTP request, ASP.NET Core automatically creates and later disposes a request scope.
- During startup, no HTTP request exists, so Program.cs creates an equivalent temporary scope deliberately.
- The startup context is used only to ensure the schema, then discarded.
- Later requests receive different scoped context instances for their own work and disposal.

Use the memory anchor: “The scope owns the context; the database outlives both.” Explain that resolving a scoped service from the application's root provider would blur or extend its intended lifetime and may be rejected when scope validation is enabled.

### Session 32 learner feedback: separate organization concepts at first use

The learner initially reasoned that Infrastructure's Domain project reference made `ClockEntryEntity` and `TimeClockDbContext` available. Correct this adjacent to the query class: those types already belong to the same Infrastructure project. A project reference exposes public types from another project; folders organize files; namespaces qualify type names; project membership determines compilation. These concepts are related but not interchangeable. In the current global-namespace learner repository, moving between Infrastructure folders does not itself require another `using` directive.

Explain that `ClockEntryDataQueries` is `static` because it is a stateless method container that is never instantiated. `sealed` only prevents inheritance and does not enforce static members or prevent ordinary construction.

### Session 32 learner feedback: make the SQLite matrix and assertions explicit

The learner accidentally completed the intended open row, added one entity twice, and initially chose a negative identity assertion. State the three-row matrix immediately before arrangement: target completed is included, target open is excluded, and other completed is excluded. Every row is a `ClockEntryEntity`; an open row leaves `Clockout` null; every instance is added exactly once through one `AddRangeAsync` followed by one `SaveChangesAsync`.

Before assertion selection, explain that `Assert.Single(results)` proves one row and returns it, while `Assert.Same(completedEntry, result)` proves the exact tracked reference. Negative identity assertions express the opposite. Limit this identity expectation to this test's same tracking `DbContext`; do not present it as a promise for every EF query or no-tracking configuration.
