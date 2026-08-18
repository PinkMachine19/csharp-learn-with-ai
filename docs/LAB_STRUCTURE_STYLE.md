# Lab Structure and Style Standard

Use this checklist when auditing or rewriting future C# Learn with AI sessions. Apply it to the requested session range only, preserve unrelated work, and inspect the learner's actual cumulative solution before editing.

## 1. Start from the real cumulative build

- Inspect the learner's current source and the preceding sessions.
- Do not claim a class, method, interface, service, test, folder, or project already exists unless an earlier session actually created it.
- If a session needs a new prerequisite, introduce it explicitly in the appropriate session.
- Preserve all earlier session work. Add new session-specific code rather than deleting previous classes or replacing entire files.
- Keep expected file paths, namespaces, project references, member names, and method signatures consistent with the learner's real solution.
- Treat spelling and casing as part of the API contract. Verify names such as `Clockout`, `ClockOutEntry`, `Employee.Identity`, and `TimeSheet` from source instead of normalizing them by preference.
- Verify nullable return types from the actual signature and use one consistent access expression throughout the concept explanation, instructions, solution, and later sessions.
- Give every production type one truthful introduction point. An earlier language experiment must use a distinct ScratchPad name rather than accidentally pre-creating a production type required by a later session.
- Keep commit messages and session numbers accurate.

## 2. Use the correct learning environment

- Put language experiments in a session-specific ScratchPad folder, such as `PinkMachine19.TimeClock.ScratchPad/Session19`.
- Put code in production projects only when a genuine TimeClock requirement justifies it.
- Do not invent production abstractions, inheritance hierarchies, services, or policies merely to demonstrate syntax.
- When the course temporarily uses a simplified project location, label it as curriculum scaffolding and briefly state the likely production location.

## 3. Explain the goal before the mechanics

Each lab should present these sections in this order:

1. `Lab X of Y — Descriptive Title`
2. **Objective** — one or two sentences describing the learning outcome.
3. **You'll Practice** — three to five concept-oriented bullets.
4. **Task** — a concise plain-English description of the finished behavior.
5. **Instructions** — detailed implementation steps, collapsed when supported.
6. **Expected behavior or validation**.
7. A collapsed **Solution**, when solutions are part of the lesson.

The learner should understand what they are building and why before reading mechanical instructions.

### Purpose reminders during a lab

Do not explain the objective only at the beginning and assume the learner will retain it through many mechanical steps. After a natural cluster of roughly two to four implementation steps, add a short purpose checkpoint that restates:

- What the learner has built so far.
- What behavior that code currently provides.
- Why the next step is necessary.
- How the next action supports the session's primary objective.

Keep the reminder to two or three TTS-friendly sentences. Do not repeat the complete lesson introduction, preview future implementation details, or turn the checkpoint into another numbered coding action. Use concrete wording tied to the current code, such as: “You now have a Task that will become faulted. The next step awaits that stored Task inside try/catch so the caller deliberately observes the failure.”

Purpose checkpoints are especially important immediately before integration, running, and final validation. Before asking the learner to edit `Program.cs`, remind them why the new experiment needs a caller. Before asking them to run, state exactly which behavior the output should prove. Before the final build and tests, distinguish verifying the focused experiment from checking that the cumulative solution remains healthy.

### Inline comprehension pauses

When a lab introduces several unfamiliar roles or a compact third-party API, add a brief unnumbered quick check after the relevant step. Ask one purpose question at a time, accept an ordinary-language answer, and keep the answer behind a small reveal. These checks are not scored quiz gates and do not increase the numbered step count.

Use a quick check to distinguish roles such as the class under test versus its test equipment, configuration versus execution, or execution versus verification. Do not ask the learner to explain the whole construction while they are still assembling it.

## 4. Write beginner-usable instructions

- Use numbered progress notation and checkboxes.
- Insert brief, unnumbered purpose checkpoints after natural groups of steps so the learner does not lose the reason behind the mechanics.
- Display every instruction using progress notation in the form `Step n/n`, where the denominator is the actual number of lab steps.
- Make each step perform one small action.
- Keep steps granular and manageable like Session 21. Do not compress several implementation actions into one broad step merely to reduce the displayed step count.
- Split a pipeline or method implementation into the order in which the learner writes it: create or open the file, declare the type, stub the method, introduce each named variable or operator, replace the temporary throw, call the method, and verify the result.
- Break complex operations into separate steps: create, stub, build, implement, call, run, and verify.
- Stub method signatures before implementing method bodies when that sequence helps the learner reason about the contract.
- Build at useful checkpoints so errors remain local.
- Tell the learner exactly which project and folder receive each file.
- Tell the learner how to invoke a new class from `Program.cs` or `Main` without removing earlier calls.
- Avoid repeating established boilerplate. Refer to the established session pattern, but keep enough context that the lab remains completable without guessing.
- Include a copyable starter comment when the learner is expected to type code.
- Before an unfamiliar method signature, provide a pasteable comment-first scaffold naming the access modifier, other modifiers, return type, method name, parameters, optional defaults, and warning-free temporary return behavior. Ask the learner to type the real C# directly beneath it; shorten the scaffold only after the grammatical shape becomes established retrieval practice.
- A comment-first scaffold guides construction without exposing the completed implementation. Keep it immediately beside the code location it describes, and tell the learner when temporary instructional comments may be removed or retained as notes.
- Preserve useful retrieval practice. Repeating a class, constructor, property, method, LINQ expression, or injected dependency can reinforce learning; do not remove repetition merely because the syntax appeared earlier.
- Repetition is welcome when it reinforces useful syntax and meaning. Repeat short reminders such as why a class is sealed, what a Task represents, and where a method belongs; do not repeat work merely to pad the lab.
- Add short reminders only at the step where they help, using wording such as `Remember from Session 21:`. Do not turn every instruction into a recap of every prior concept.
- Distinguish setup code from the concept being practiced.
- Include signature-reading help when LINQ, delegates, Tasks, or testing APIs expose long IntelliSense signatures. Prefer a focused optional sidebar when the supporting concept would interrupt the primary lab.
- Do not assume a learner can independently compose a large `Program.cs` demonstration unless the course previously practiced that exact composition.
- Use `Step n/n` numbering consistently and keep instructions concise and text-to-speech friendly.
- Present each numbered step as one complete TTS unit. End it with a visible “This step is complete when…” condition; if that condition needs several hidden parts, split them into additional numbered steps instead.
- When a guided lab is delivered one step at a time, state how many official numbered steps remain after every step. Never hide required work behind “part” labels that do not change the published denominator.
- Treat repository housekeeping that teaches no session concept as unnumbered pre-lab cleanup rather than inflating the learning-step count.

### Paste-ready instruction standard for Sessions 01–24

- Render every learner instruction as one or more valid C# `//` comments so the learner can paste it directly into Visual Studio Code as a temporary implementation checklist.
- Include the exact class, method, field, parameter, and variable names chosen by the lesson.
- Never place plain instructional prose inside a C# code block. Every instructional line in such a block must begin with `//`.
- Keep completed implementations behind the existing Solution Reveal. Paste-ready instructions describe the next action; they do not reveal the finished code.
- Inspect the learner's actual source before naming a namespace or folder. If the project has no explicit namespace declaration, do not instruct the learner to add one.
- Use the folders that exist in the cumulative learner project rather than assuming a `Services` folder, Domain-root placement, or another convention.

## 5. Teach rather than generate

- Do not ask the learner to replace an entire file with completed code.
- Do not provide a complete implementation before the learner attempts the steps.
- Provide only the minimum starter code needed for the current action.
- Make the learner write the important code incrementally.
- Put the complete answer only in a collapsed Solution section.
- The learner should spend substantially more time writing and reasoning than copying.
- Separate incidental integration setup from the current learning code. Label safe boilerplate explicitly as `Setup code: paste this`, and label the few lines that exercise the current concept as `Learning code: write this yourself`.
- If integration itself is an objective, teach it through separate granular steps. Otherwise, do not make the learner reverse-engineer several earlier sessions just to reach the new concept.

## 6. Make explanations explicit where mistakes are likely

- Explain unfamiliar types or APIs briefly before using them, such as `HashSet<T>`, `IEnumerable<T>`, `sealed`, or constructor injection.
- Before first use of an external library, state its overall job and identify which visible names belong to the library. Show genuinely new third-party syntax on first use instead of asking the learner to guess it from prose or discover it through IntelliSense.
- Prefer an official SDK or framework template for routine project scaffolding. Inspect an existing target directory before generation, preserve intentional files, explain what the command creates, and do not recommend destructive overwrite flags without evidence that replacement is intended.
- For first exposure to nested generic framework contracts or inferred delegates, show the complete types and relationships before offering conventional inference. Attribute inference to the C# compiler; the IDE displays language analysis but does not define the language rule.
- For fluent library syntax, identify the object currently held, what each call configures or checks, who invokes any lambda later, and what role the returned object plays in enabling the next chained call.
- After a small framework-heavy cluster, offer a collapsed “What you should be asking right now” section with two or three conversational questions and answers. Explain required meaning at the point of use; do not outsource essential understanding to a glossary.
- State important filtering conditions directly. Do not make learners infer why open or incomplete entries must be excluded.
- Explain the semantic reason for a design choice, not only its syntax.
- Distinguish teaching simplifications from typical production architecture.
- Keep optional or supporting theory out of the primary session when it would distract from that session's objective. Prefer a brief cross-reference or one focused, skippable sidebar.
- When a LINQ expression is neither stored, returned, nor enumerated, say: "LINQ returns a new sequence. It does not change the source, so the returned sequence must be stored, returned, or enumerated."
- Explain sequence identity for reference types with the memory anchor: "New sequence. Same objects." `Where`, `OrderBy`, and similar operators do not clone the objects they return.
- Distinguish deferred queries from materialized results precisely. `Where` and `OrderByDescending` return new `IEnumerable<T>` queries without modifying the source. `ToList` executes the query at that point and stores the results in a new `List<T>`; it does not prevent later LINQ because `List<T>` also implements `IEnumerable<T>`.
- Use the memory anchor: "No ToList: keep the query deferred. ToList: run it now and store the results."
- Build dense LINQ incrementally with named intermediate variables. For grouping, explain `GroupBy` as one bucket per key, `group.Key` as the bucket label, enumeration as the bucket's items, `Select` as one result per bucket, and `Sum` as collapsing that bucket to one total.
- Do not require learners to memorize complex generic method signatures. For `Join`, teach its four arguments separately with the anchor: "Second collection. First key. Second key. Final result."
- Explain why a `Join` is needed, identify the value supplied by each sequence, and state that the standard LINQ `Join` is an inner join whose unmatched keys produce no result.
- For dense IntelliSense signatures, teach learners to identify the receiver, open signature help, move among overloads, read one parameter at a time, substitute concrete types for `TOuter`, `TInner`, `TKey`, and `TResult`, and use documentation or Go to Definition when needed.
- When nullable operators appear, explain both halves: `?.` accesses a member only when a value exists, while `??` supplies the non-null fallback required by the consuming expression. Also explain why the domain's earlier filtering should normally make that fallback unnecessary at runtime.

## 7. Use meaningful visuals and interactions

- Use diagrams only when they clarify a relationship, boundary, sequence, contract, or state change.
- Do not use decorative SVGs that merely repeat the title.
- Ensure every diagram is specific to the lab's concept and has accessible explanatory text.
- Read the lesson before designing its Mental Models and identify the exact behavior the learner must remember.
- Choose the number of visuals the lesson genuinely needs. Do not force a fixed count or add filler merely to reach three or four cards; normally stay below six.
- Give every visual a concrete, recognizable metaphor that shows the mechanism: objects moving, a boundary restricting access, a state changing, a resource being transferred, or a before/after consequence.
- Approximately three short anchor labels are enough. The picture must still communicate useful meaning when its labels are mentally covered.
- Within one session, do not reuse the same central object, silhouette, composition, pipeline, boxes, arrows, or background scene and claim that changed labels or colors make it a new Mental Model.
- Reusing a scene is valid only for a meaningful multi-frame progression whose visible state change teaches causality. Treat that progression as one Mental Model rather than several unrelated cards.
- Make nearby sessions visually distinguishable so recalling an image also helps identify its lesson.
- Audit each visual with five tests: teaching, recall, text removal, within-session duplication, and necessity.
- For a batch, compare the SVG structure with text removed. Two cards with effectively identical geometry require redesign unless they form an intentional progression.
- Keep one consistent course design system—palette, typography, line weight, accessibility, and card layout—while varying the actual scene and metaphor.
- Preserve sentence-click highlighting where the session standard requires it.
- Include progress checkboxes for lab steps.
- When requested for focus support, add numbered paragraph progress without interfering with bookmarks or other interactions.

## 8. Keep solutions and validation truthful

### Required lesson-page controls

- Every generated primary lesson page must initialize and display the Notes and Bookmark floating buttons used by the established session-page design.
- When adding a new session identifier format, such as an alphanumeric identifier, verify that widget URL detection recognizes the route. Loading the widget files is not enough; confirm the runtime creates both `.notes-fab` and `.bookmark-fab`.
- Validate at least one generated page for each supported identifier format: integer, decimal, and alphanumeric.
- Keep these controls available alongside shortcuts and other established lesson interactions. Do not omit them from a new primary session merely because its identifier or route differs from earlier sessions.

- The collapsed solution must match the instructions, expected output, actual member names, and project structure.
- Code examples in the concept overview, lab, expected-files table, solution reveal, standalone lab, and synchronized source must agree.
- List every file added, modified, or deleted by the lab and no files the lab does not touch.
- Run the relevant application or ScratchPad project, build the solution, run focused tests, run the full test suite when appropriate, and validate the generated site.
- Report unavailable verification honestly instead of implying it passed.

## 9. Batch-audit checklist

When correcting several sessions together, verify the whole range as one progression:

- Does every session begin from the previous session's actual end state?
- Does every new artifact have one clear introduction point?
- Do earlier ScratchPad examples avoid claiming names reserved for later production artifacts?
- Do later sessions depend only on artifacts already created?
- Are ScratchPad and production responsibilities separated consistently?
- Are complex tasks decomposed into small steps?
- Are visuals meaningful?
- Are instructions, solutions, file tables, generated pages, and commit messages synchronized?
- Do App demonstrations use matching IDs and date ranges so filters and inner joins produce the documented output?
- Is incidental setup visibly separated from the code that practices the session's new concept?
- Does the complete course build and validate after the batch?

## Reference batch

Sessions 18–23 established the current model:

- Session 18 extracts one truthful repository interface from existing behavior.
- Session 19 keeps inheritance isolated in `ScratchPad/Session19`.
- Session 20 introduces `ClockEntryService`, constructor injection, dependency direction, and manual composition.
- Session 21 introduces `PayrollService` with practical LINQ.
- Session 22 explicitly creates `WorkSummary` before grouping and joining into it.
- Session 23 proves deferred execution and materialization with focused tests.

Use this reference for structure and instructional quality, but continue to verify every future session against the actual learner repository rather than copying assumptions from these sessions.
