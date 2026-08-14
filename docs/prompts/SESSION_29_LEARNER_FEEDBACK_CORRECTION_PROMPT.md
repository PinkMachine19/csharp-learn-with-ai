# Codex Prompt — Correct Session 29 from Learner Feedback

Perform a focused learner-feedback correction pass on **Session 29 — Unit Tests and Arrange–Act–Assert** in the C# Learn with AI course.

Use the repository's actual current state. Before editing, read these files completely:

- `docs/LAB_STRUCTURE_STYLE.md`
- `docs/LEARNER_FEEDBACK.md`
- `site/data/sessions/session-29.json`
- The learner's current `PayrollServiceTests.cs`
- The actual `PayrollService.CalculateTotalHours` signature
- Existing test-project conventions

Do not modify, complete, or rewrite the learner's implementation. The learner's current test code belongs to the learner.

## Preserve Session 29

Keep the existing:

- Primary learning objective
- `PayrollService` scenario
- Two-test structure
- Exactly 14 numbered steps
- Synchronous `CalculateTotalHours` API
- Seven-hour calculation
- Empty-repository boundary test
- Production-code boundary
- Complete solution behind Solution Reveal

Do not introduce Moq, async tests, `Task`, or `CalculateTotalHoursAsync`. Do not rename the existing production method or its parameters. Do not modify production code or Session 30 and later lesson content.

## Correction 1 — Encourage typing meaningful test names

Explain this convention before requiring the first test method name:

```text
MethodUnderTest_WhenCondition_ExpectedResult
```

Explain how the three parts communicate:

- The method under test
- The arranged condition
- The expected result

Encourage the learner to type important test method names instead of copying completed declarations. Typing the name is part of learning how tests communicate behavior.

Keep visible instructions as paste-ready C# comments. Do not expose the completed method declaration outside Solution Reveal.

## Correction 2 — Explain explicit types versus var

The learner prefers declarations such as:

```csharp
ClockEntryRepository repository = new();
PayrollService service = new(repository);
```

Explain:

- Explicit local types and `var` are both statically typed.
- `var` asks the compiler to infer the compile-time type.
- `var` is not dynamic typing.
- Explicit types help when seeing the type improves understanding.
- `var` helps when the type is obvious and repeating it adds little.
- Target-typed `new` keeps explicit declarations concise.

Use the memory anchor:

> Use `var` when the type is obvious and unimportant. Spell out the type when seeing it helps the reader.

Do not force the completed solution to use `var`. Prefer the learner's explicit-type style where it remains readable.

## Correction 3 — Teach DateTime constructor order

Before asking the learner to create a fixed date, show this signature:

```csharp
DateTime(int year, int month, int day)
```

Explain that the arguments are:

1. Year
2. Month
3. Day

The learner twice reversed these arguments while trying to represent August 14, 2026. Ask the learner to substitute the intended values without exposing more completed test code than necessary.

Explain that fixed dates make tests deterministic and repeatable.

## Correction 4 — Explain IDE and CLI test workflows

Near the focused-test step, explain:

- VS Code's Testing panel is normal for everyday focused test runs.
- Visual Studio Test Explorer and Rider's test runner are also normal.
- CLI commands are editor-independent, repeatable, precise, and suitable for continuous integration.
- Developers commonly reuse long commands through terminal history, editor tasks, or scripts.
- The lab shows the full command so the learner knows exactly which project, configuration, and test filter are executed.
- The learner may run the same two focused tests through VS Code if they select and review the intended tests.

Do not imply that manually retyping a long CLI command is the only professional workflow.

## Instruction requirements

- Keep exactly 14 numbered steps.
- Keep instructions short and TTS-friendly.
- Every visible implementation instruction must be a paste-ready C# comment block.
- Every instructional line inside a C# block must start with `//`.
- Do not expose completed implementation statements in visible instructions.
- Keep the complete `PayrollServiceTests` implementation inside Solution Reveal.
- Preserve or improve unnumbered purpose checkpoints.
- Do not count purpose checkpoints as steps.

## Synchronize

- `site/data/sessions/session-29.json`
- Generated Session 29 lesson page
- Generated standalone lab page
- Generated quiz page if wording changes
- `docs/LEARNER_FEEDBACK.md` only if another durable clarification is genuinely necessary
- Authoring or validation support only if genuinely required

## Validation

1. Confirm the lesson still contains exactly 14 steps.
2. Confirm the two intended tests remain unchanged in scope.
3. Confirm the test-name convention is taught before requiring the first name.
4. Confirm explicit types and `var` are explained accurately.
5. Confirm `DateTime(int year, int month, int day)` appears before the learner constructs the fixed date.
6. Confirm the focused-test step acknowledges both IDE and CLI workflows.
7. Confirm visible C# instructions contain only paste-ready comments.
8. Confirm the complete implementation remains behind Solution Reveal.
9. Regenerate and validate the complete site.
10. Confirm Notes, Bookmark, and Shortcuts initialize on Session 29.
11. Confirm learner and production code remain unchanged.
12. Do not push unless explicitly requested.

## Final report

Report:

- Exact lesson corrections
- Exact files changed
- Final step count
- Purpose-checkpoint count
- How test naming is now taught
- How explicit types versus `var` are now explained
- How `DateTime` argument order is now taught
- How IDE versus CLI testing is now explained
- Site-generation and validation results
- Widget-verification result
- Confirmation that learner and production code were unchanged
