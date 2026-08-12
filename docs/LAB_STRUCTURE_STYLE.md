# Lab Structure and Style Standard

Use this checklist when auditing or rewriting future C# Learn with AI sessions. Apply it to the requested session range only, preserve unrelated work, and inspect the learner's actual cumulative solution before editing.

## 1. Start from the real cumulative build

- Inspect the learner's current source and the preceding sessions.
- Do not claim a class, method, interface, service, test, folder, or project already exists unless an earlier session actually created it.
- If a session needs a new prerequisite, introduce it explicitly in the appropriate session.
- Preserve all earlier session work. Add new session-specific code rather than deleting previous classes or replacing entire files.
- Keep expected file paths, namespaces, project references, member names, and method signatures consistent with the learner's real solution.
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

## 4. Write beginner-usable instructions

- Use numbered progress notation and checkboxes.
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

## 6. Make explanations explicit where mistakes are likely

- Explain unfamiliar types or APIs briefly before using them, such as `HashSet<T>`, `IEnumerable<T>`, `sealed`, or constructor injection.
- State important filtering conditions directly. Do not make learners infer why open or incomplete entries must be excluded.
- Explain the semantic reason for a design choice, not only its syntax.
- Distinguish teaching simplifications from typical production architecture.
- Keep optional or supporting theory out of the primary session when it would distract from that session's objective. Prefer a brief cross-reference or one focused, skippable sidebar.
- When a LINQ expression is neither stored, returned, nor enumerated, say: "LINQ returns a new sequence. It does not change the source, so the returned sequence must be stored, returned, or enumerated."
- Distinguish deferred queries from materialized results precisely. `Where` and `OrderByDescending` return new `IEnumerable<T>` queries without modifying the source. `ToList` executes the query at that point and stores the results in a new `List<T>`; it does not prevent later LINQ because `List<T>` also implements `IEnumerable<T>`.
- Use the memory anchor: "No ToList: keep the query deferred. ToList: run it now and store the results."

## 7. Use meaningful visuals and interactions

- Use diagrams only when they clarify a relationship, boundary, sequence, contract, or state change.
- Do not use decorative SVGs that merely repeat the title.
- Ensure every diagram is specific to the lab's concept and has accessible explanatory text.
- Preserve sentence-click highlighting where the session standard requires it.
- Include progress checkboxes for lab steps.
- When requested for focus support, add numbered paragraph progress without interfering with bookmarks or other interactions.

## 8. Keep solutions and validation truthful

- The collapsed solution must match the instructions, expected output, actual member names, and project structure.
- Code examples in the concept overview, lab, expected-files table, solution reveal, standalone lab, and synchronized source must agree.
- List every file added, modified, or deleted by the lab and no files the lab does not touch.
- Run the relevant application or ScratchPad project, build the solution, run focused tests, run the full test suite when appropriate, and validate the generated site.
- Report unavailable verification honestly instead of implying it passed.

## 9. Batch-audit checklist

When correcting several sessions together, verify the whole range as one progression:

- Does every session begin from the previous session's actual end state?
- Does every new artifact have one clear introduction point?
- Do later sessions depend only on artifacts already created?
- Are ScratchPad and production responsibilities separated consistently?
- Are complex tasks decomposed into small steps?
- Are visuals meaningful?
- Are instructions, solutions, file tables, generated pages, and commit messages synchronized?
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
