# Secondary and Tertiary Course Thoughts

This document captures useful ideas that arise during a lesson but are not part of the current session's primary objective. Preserve them for later design work without expanding or interrupting the active lab.

## Terminal-first project navigation with discoverability

### Learner need

The learner would like to navigate project folders and create files from the WSL Bash terminal instead of depending on the VS Code Explorer. Raw long paths are difficult to type and Bash does not currently feel as discoverable as C# IntelliSense.

The desired experience is approximately:

```bash
touch "$infrastructure_dir/TimeClockDbContext.cs"
```

The learner wants short, meaningful folder aliases or variables plus completion that helps discover valid folders and filenames.

### Future investigation

Create an optional terminal-navigation lesson or tool note that compares:

- Built-in Bash tab completion for paths and commands.
- Installing or enabling `bash-completion` where appropriate.
- Using descriptive session variables such as `domain_dir`, `infrastructure_dir`, and `tests_dir` from the repository root.
- Small repository-local navigation functions or scripts that print or select known project paths.
- Interactive directory and file selection with tools such as `fzf` or `zoxide`, if the learner chooses to install optional tools.
- VS Code integrated-terminal shell integration and command/path suggestions.
- `Ctrl+R`, shell history, and reusable commands for recovering earlier paths.
- Safe file creation with `touch`, followed by opening the file through `code` when available.

Do not assume an optional shell tool is installed. Teach built-in tab completion first, then clearly label enhancements and installation steps as optional.

### Possible baseline workflow

From the repository root:

```bash
domain_dir="src/PinkMachine19.TimeClock.Domain"
infrastructure_dir="src/PinkMachine19.TimeClock.Infrastructure"
tests_dir="tests/PinkMachine19.TimeClock.Domain.Tests"
```

Then create or inspect files with readable paths:

```bash
touch "$infrastructure_dir/TimeClockDbContext.cs"
ls "$infrastructure_dir"
```

If the `code` command is available in WSL:

```bash
code "$infrastructure_dir/TimeClockDbContext.cs"
```

These are Bash variables, not C# variables and not permanent aliases. They last for the current shell session unless deliberately placed in a script or shell configuration.

### Course-design boundary

This topic is secondary to Session 31's EF Core objective. Do not add terminal configuration, optional tool installation, or a navigation detour to the required persistence lab. A future optional tooling module or course-wide command reference is the appropriate home.

## Triage rule for future entries

- **Primary:** required to understand or complete the active session safely.
- **Secondary:** valuable supporting fluency that deserves an optional note or drill.
- **Tertiary:** an enhancement, tool preference, or future exploration that should not alter current prerequisites.

When adding an entry, state the learner need, possible future treatment, and why it should remain outside the active lesson.

## Searchable terminology and grammar refresher

### Learner need

Later framework lessons combine earlier C# grammar with many framework-specific terms. The learner would like a fast way to recover definitions without repeating an entire lesson, especially for terms such as base-constructor initializer, generic type parameter, invariant, materialization, provider, tracking, `DbSet`, composition root, and ownership.

### Possible future treatment

Investigate a searchable optional terms/reference section organized by:

- C# language grammar
- .NET runtime and resource ownership
- Dependency injection
- EF Core and persistence
- Testing
- HTTP and application boundaries

Each entry should include a one-sentence definition, one small syntax shape, one concrete course example, the session that first introduced it, and links to relevant drills. Prefer just-in-time reminders in active labs; use the reference as recovery support rather than making a terminology lesson a cumulative prerequisite.

### Course-design boundary

Do not solve an unclear active lab merely by sending the learner to a glossary. Session-specific terms must still be explained where they are first required. The broader searchable reference is secondary course infrastructure and should be designed separately.
