import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sessionsDir = path.join(root, "site", "data", "sessions");
const sequence = JSON.parse(await readFile(path.join(root, "site", "data", "build-sequence.json"), "utf8"));
const sequenceByNumber = new Map(sequence.sessions.map((item) => [String(item.number), item]));
const f = (path, action, why) => ({ path, action, why });
const runAll = "dotnet build PinkMachine19.TimeClock.sln --configuration Release && dotnet test PinkMachine19.TimeClock.sln --configuration Release --no-build";
const runScratch = "dotnet run --project src/PinkMachine19.TimeClock.ScratchPad/PinkMachine19.TimeClock.ScratchPad.csproj --configuration Release";

const plans = {
  "1": {
    objective: "Scaffold the permanent TimeClock production, test, and ScratchPad projects in the learner workspace.",
    starting: "Begin in the empty learner workspace. No solution, projects, production code, tests, or experiments exist yet.",
    steps: [
      { text: "In a Bash-compatible terminal, define names for the solution file and all six project folders. These are temporary terminal variables, not C# variables. For now, notice that name=value stores text and $name reuses it; C# variables are taught properly in Session 03. Keep this terminal open for the remaining steps.", code: "solution_name=\"PinkMachine19.TimeClock\"\nsolution_file=\"${solution_name}.sln\"\ndomain_project=\"src/${solution_name}.Domain\"\napp_project=\"src/${solution_name}.App\"\ninfrastructure_project=\"src/${solution_name}.Infrastructure\"\nweb_project=\"src/${solution_name}.Web\"\nscratchpad_project=\"src/${solution_name}.ScratchPad\"\ndomain_tests_project=\"tests/${solution_name}.Domain.Tests\"" },
      { text: "Create the classic solution file using solution_name. Quoting the variable keeps the command safe if a future name contains spaces.", code: "dotnet new sln -n \"$solution_name\" -f sln" },
      { text: "Create the four production projects, the permanent ScratchPad console project, and the Domain test project using the folder variables. ScratchPad is a notebook that stays in the solution for the entire course.", code: "dotnet new classlib -o \"$domain_project\"\ndotnet new console -o \"$app_project\"\ndotnet new classlib -o \"$infrastructure_project\"\ndotnet new web -o \"$web_project\"\ndotnet new console -o \"$scratchpad_project\"\ndotnet new xunit -o \"$domain_tests_project\"" },
      { text: "Add all six projects to solution_file. Each project path reuses both its folder variable and solution_name. Creating a project does not add it automatically.", code: "dotnet sln \"$solution_file\" add \"$domain_project/${solution_name}.Domain.csproj\"\ndotnet sln \"$solution_file\" add \"$app_project/${solution_name}.App.csproj\"\ndotnet sln \"$solution_file\" add \"$infrastructure_project/${solution_name}.Infrastructure.csproj\"\ndotnet sln \"$solution_file\" add \"$web_project/${solution_name}.Web.csproj\"\ndotnet sln \"$solution_file\" add \"$scratchpad_project/${solution_name}.ScratchPad.csproj\"\ndotnet sln \"$solution_file\" add \"$domain_tests_project/${solution_name}.Domain.Tests.csproj\"" },
      { text: "List and build solution_file. Expect six project paths and zero build errors.", code: "dotnet sln \"$solution_file\" list\ndotnet build \"$solution_file\"" }
    ],
    validation: "solution_file=\"PinkMachine19.TimeClock.sln\"\ndotnet build \"$solution_file\" --configuration Release && dotnet test \"$solution_file\" --configuration Release --no-build",
    expected: [f("PinkMachine19.TimeClock.sln", "Add", "Track all six permanent projects."), f("src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj", "Add", "Create the business-rule project."), f("src/PinkMachine19.TimeClock.Domain/Class1.cs", "Add", "Record the class-library template file until Session 06 replaces it."), f("src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj", "Add", "Create the console host."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Add", "Record the console template entry point until Session 06 adds production behavior."), f("src/PinkMachine19.TimeClock.Infrastructure/PinkMachine19.TimeClock.Infrastructure.csproj", "Add", "Create the persistence project."), f("src/PinkMachine19.TimeClock.Infrastructure/Class1.cs", "Add", "Record the infrastructure template until EF persistence replaces it."), f("src/PinkMachine19.TimeClock.Web/PinkMachine19.TimeClock.Web.csproj", "Add", "Create the HTTP host."), f("src/PinkMachine19.TimeClock.Web/Program.cs", "Add", "Record the scaffolded web host until Session 33 adds endpoints."), f("src/PinkMachine19.TimeClock.ScratchPad/PinkMachine19.TimeClock.ScratchPad.csproj", "Add", "Provide the permanent experiment notebook."), f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Add", "Preserve experiments from Session 03 onward."), f("tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj", "Add", "Create the permanent test project."), f("tests/PinkMachine19.TimeClock.Domain.Tests/UnitTest1.cs", "Add", "Record the test template until the first meaningful tests replace it.")],
    behavior: "One persistent learner solution contains four production projects, one ScratchPad project, and one test project. It builds before any business code is added."
  },
  "2": {
    objective: "Add the permanent dependency arrows required by the zero-to-N solution without adding business code.",
    starting: "Session 01 left six scaffolded projects in one learner solution. They contain only template code and do not reference each other.",
    steps: [
      { text: "Add App, Infrastructure, Web, ScratchPad, and Domain.Tests references to Domain. Each is an independent consumer; Domain references none of them.", code: "dotnet add src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj\ndotnet add src/PinkMachine19.TimeClock.Infrastructure/PinkMachine19.TimeClock.Infrastructure.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj\ndotnet add src/PinkMachine19.TimeClock.Web/PinkMachine19.TimeClock.Web.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj\ndotnet add src/PinkMachine19.TimeClock.ScratchPad/PinkMachine19.TimeClock.ScratchPad.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj\ndotnet add tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj" },
      "Open each edited .csproj and identify the ProjectReference path created by the command.",
      { text: "Temporarily add Domain-to-App, observe that tooling permits the bad direction, then remove it immediately.", code: "dotnet add src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj reference src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj\ndotnet remove src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj reference src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj" },
      { text: "Build the learner solution and verify Domain has no ProjectReference.", code: "dotnet build PinkMachine19.TimeClock.sln" }
    ],
    expected: [f("src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj", "Modify", "Reference Domain."), f("src/PinkMachine19.TimeClock.Infrastructure/PinkMachine19.TimeClock.Infrastructure.csproj", "Modify", "Reference Domain."), f("src/PinkMachine19.TimeClock.Web/PinkMachine19.TimeClock.Web.csproj", "Modify", "Reference Domain."), f("src/PinkMachine19.TimeClock.ScratchPad/PinkMachine19.TimeClock.ScratchPad.csproj", "Modify", "Let experiments use production types when appropriate."), f("tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj", "Modify", "Test Domain behavior.")],
    behavior: "All consumers point toward Domain, Domain points nowhere, and the scaffold still builds."
  },
  "3": {
    objective: "Add the first preserved numeric-expression experiment to ScratchPad.",
    starting: "The scaffold and references exist. Production projects still contain no TimeClock behavior. ScratchPad contains only its template Program.cs.",
    steps: [
      { copyInstruction: true, text: "Open src/PinkMachine19.TimeClock.ScratchPad/Program.cs. Delete only the template Console.WriteLine statement that prints Hello, World! Replace it with a comment naming Session 03 and its topic. This label keeps the experiment identifiable when later sessions add more examples to the same file.", reveals: [{ title: "Check the Session 03 heading", blurred: true, code: "// Session 03 — Variables, expressions, and numeric types" }] },
      { copyInstruction: true, text: "Directly below the heading, declare a variable named measuredHours. Give it the type double and initialize it to 8.0. This value represents hours supplied by a measurement-oriented API. Do not print it yet.", reveals: [{ title: "Check the measured-hours declaration", blurred: true, code: "double measuredHours = 8.0;" }] },
      { copyInstruction: true, text: "Below measuredHours, declare scheduledHours as a decimal initialized to 7.5. Then declare recordedHours as a decimal and assign measuredHours to it using an explicit cast. The m suffix belongs on the decimal literal; the cast belongs around measuredHours because double does not convert to decimal implicitly.", reveals: [{ title: "Check the decimal declarations and conversion", blurred: true, code: "decimal scheduledHours = 7.5m;\ndecimal recordedHours = (decimal)measuredHours;" }] },
      { copyInstruction: true, text: "Below those declarations, create a decimal variable named varianceHours. Calculate it by subtracting scheduledHours from recordedHours, in that order. Then use the interpolation and format-specifier side note above to add three Console.WriteLine statements: print Scheduled and Recorded with F2, and print Variance with the three-section positive;negative;zero format shown in the note.", reveals: [{ title: "Check the calculation and output statements", blurred: true, code: "decimal varianceHours = recordedHours - scheduledHours;\n\nConsole.WriteLine($\"Scheduled: {scheduledHours:F2}\");\nConsole.WriteLine($\"Recorded: {recordedHours:F2}\");\nConsole.WriteLine($\"Variance: {varianceHours:+0.00;-0.00;0.00}\");" }] },
      { copyInstruction: true, text: "Open a terminal at the solution root. Run ScratchPad with the first command below. Confirm that it prints Scheduled 7.50, Recorded 8.00, and Variance +0.50. Then use the second command to build and test the complete solution. The lab is complete when ScratchPad prints those values and the solution reports zero build errors and zero failing tests.", code: `${runScratch}\n${runAll}`, reveals: [{ title: "Check the expected ScratchPad output", blurred: true, code: "Scheduled: 7.50\nRecorded: 8.00\nVariance: +0.50" }] }
    ],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Preserve the numeric-expression experiment without inventing production behavior.")],
    behavior: "ScratchPad retains a labeled Session 03 experiment and prints 7.50 scheduled, 8.00 recorded, and +0.50 variance. Production code remains empty."
  },
  "03.5": {
    objective: "Add a permanent numeric-type comparison beside the Session 03 ScratchPad experiment.",
    starting: "ScratchPad contains the Session 03 numeric-expression section. Production code is still intentionally empty.",
    steps: [
      "Keep the Session 03 experiment. Add a new Session 03.5 heading below it rather than replacing earlier work.",
      "Compare int and long choices for counts, then compare double and decimal declarations for 100.99.",
      "Predict the two 0.1 + 0.2 equality results before running.",
      "Add the double and decimal comparisons and record one sentence explaining the representation difference.",
      { text: "Run ScratchPad and verify the double comparison is false while the decimal comparison is true.", code: runScratch }
    ],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Preserve the numeric-family comparison after Session 03.")],
    behavior: "Both ScratchPad experiments remain, and the new output demonstrates why type choice follows meaning rather than appearance."
  },
  "4": {
    objective: "Extend the preserved ScratchPad numeric example with decisions and pattern-based classification.",
    starting: "ScratchPad already calculates varianceHours in its Session 03 section. No production requirement needs schedule classification yet.",
    steps: ["Open src/PinkMachine19.TimeClock.ScratchPad/Program.cs. Scroll to the end of the file. Do not delete or rewrite the Session 03 or Session 03.5 experiments; Session 04 must be a new section below all earlier code.", { text: "At the end of Program.cs, add two blank lines, then type this heading and variable. This is the only new input variable for the lab. The starting value 0.5m represents recorded time that is half an hour over the schedule.", code: "// Session 04 — Control flow and pattern decisions\ndecimal decisionVarianceHours = 0.5m;" }, "Use one decimal variable and test one value at a time. Do not create three variables, an array, a list, or a loop. Data structures and loops are taught in later sessions. In this lab you will edit the value on this one line and rerun the program.", "Before writing the decision, record three predictions in your notes: what status should 0.5m produce, what status should 0m produce, and what status should -0.5m produce? Do this before continuing so the program can check your reasoning.", { text: "Directly below decisionVarianceHours, add this switch expression. Do not place it inside any earlier section. The switch reads the decimal value and stores one text result in scheduleStatus.", code: "string scheduleStatus = decisionVarianceHours switch\n{\n    > 0m => \"over schedule\",\n    < 0m => \"under schedule\",\n    _ => \"on schedule\"\n};" }, { text: "Directly below the switch expression, add these two output statements. The first prints the value that was tested; the second prints the result returned by the matching switch arm.", code: "Console.WriteLine($\"Variance: {decisionVarianceHours:+0.00;-0.00;0.00}\");\nConsole.WriteLine($\"Status: {scheduleStatus}\");" }, { text: "Before running, compare your new Session 04 section with this completed block. It should appear once at the end of Program.cs. Fix missing braces, commas, semicolons, or quotation marks now.", code: "// Session 04 — Control flow and pattern decisions\ndecimal decisionVarianceHours = 0.5m;\n\nstring scheduleStatus = decisionVarianceHours switch\n{\n    > 0m => \"over schedule\",\n    < 0m => \"under schedule\",\n    _ => \"on schedule\"\n};\n\nConsole.WriteLine($\"Variance: {decisionVarianceHours:+0.00;-0.00;0.00}\");\nConsole.WriteLine($\"Status: {scheduleStatus}\");" }, { text: "Save Program.cs and run ScratchPad with the starting value 0.5m. In the Session 04 output, expect Variance: +0.50 followed by Status: over schedule. Earlier-session output should still appear too.", code: runScratch }, { text: "Test the boundary value. Replace only the decisionVarianceHours declaration with the line below, save the file, and run the same dotnet run command again. Do not add a second declaration. Expect Variance: 0.00 and Status: on schedule.", code: "decimal decisionVarianceHours = 0m;" }, { text: "Test the negative path. Replace only that same declaration with the line below, save, and run the same command again. Expect Variance: -0.50 and Status: under schedule.", code: "decimal decisionVarianceHours = -0.5m;" }, "Compare all three actual results with the predictions you wrote earlier. If one prediction differed, explain which comparison or fallback arm changed your reasoning before continuing.", { text: "Restore the positive starting value so Session 05 begins from the documented code, then save Program.cs.", code: "decimal decisionVarianceHours = 0.5m;" }, { text: "Build the complete solution. A successful build confirms the new section compiles with all preserved earlier work; it does not by itself prove that the three status labels have the correct meaning.", code: "dotnet build PinkMachine19.TimeClock.sln --configuration Release" }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Preserve a control-flow experiment without adding an unverified TimeClock rule.")],
    behavior: "ScratchPad retains every earlier experiment. Running Session 04 separately with 0.5m, 0m, and -0.5m produces over schedule, on schedule, and under schedule respectively. The final saved value is restored to 0.5m, and production code remains unchanged."
  },
  "5": {
    objective: "Refactor the ScratchPad calculations into named methods while preserving every earlier experiment's output.",
    starting: "ScratchPad contains labeled numeric and decision sections written as top-level statements.",
    preserveStructuredLabs: true,
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Teach methods and scope in the permanent notebook without premature production design.")],
    behavior: "All ScratchPad examples still run, but calculation and classification now use named local methods."
  }
};

Object.assign(plans, {
  "6": {
    objective: "Create the first production domain models—Address, Employee, and ClockEntry—from the verified product vocabulary.",
    starting: "The solution and ScratchPad experiments exist, but Domain still contains only the class-library template. This is the first session that adds TimeClock business code.",
    steps: ["Delete the template Class1.cs from Domain.", "Create Address.cs with the address values required by the product brief.", "Create Employee.cs with identity, name, and address state established by its constructor.", "Create ClockEntry.cs with EmployeeId and ClockIn established by its constructor; do not add clock-out rules yet.", "In App/Program.cs, construct one Employee and one open ClockEntry and print their initial state.", { text: "Build, run App, and test the scaffold.", code: "dotnet run --project src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj --configuration Release\n" + runAll }],
    expected: [f("src/PinkMachine19.TimeClock.Domain/Class1.cs", "Delete", "Remove the class-library placeholder when real domain models arrive."), f("src/PinkMachine19.TimeClock.Domain/Address.cs", "Add", "Represent an employee address."), f("src/PinkMachine19.TimeClock.Domain/Employee.cs", "Add", "Represent an employee."), f("src/PinkMachine19.TimeClock.Domain/ClockEntry.cs", "Add", "Represent an employee clock-in."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Exercise the first production models.")],
    behavior: "The production application creates and displays its first employee and open clock entry; no service or persistence code exists yet."
  },
  "7": {
    objective: "Extend the production models with initialization guarantees, nullable clock-out state, and completion invariants.",
    starting: "Session 06 created Address, Employee, and an open ClockEntry with EmployeeId and ClockIn. ClockEntry cannot be completed or calculate duration yet.",
    steps: ["Enable nullable analysis if the template did not already enable it.", "Add nullable ClockOut with a private setter to ClockEntry.", "Add ClockOutEmployee and reject a second completion or a completion before ClockIn.", "Add GetDuration and reject calls while the entry remains open.", "Update App to complete the entry and print its duration; keep the employee example."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntry.cs", "Modify", "Protect completion and duration invariants."), f("src/PinkMachine19.TimeClock.Domain/Employee.cs", "Modify", "Make required initialization explicit."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Demonstrate a valid completed entry.")],
    behavior: "ClockEntry represents open and completed states safely, App completes one entry, and invalid duration access is impossible without an exception."
  },
  "8": {
    objective: "Add a preserved ScratchPad experiment that observes value copying and reference sharing through the production models.",
    starting: "Production contains Employee, Address, and ClockEntry from Sessions 06–07. ScratchPad already references Domain and retains Sessions 03–05.",
    steps: ["Add a Session 08 heading below the existing ScratchPad work.", "Copy an int EmployeeId and change the copy; observe that the original value is unchanged.", "Assign one Employee reference to a second variable and rename through one reference; observe the shared object.", "Write the prediction before each mutation and keep the observations as comments.", { text: "Run ScratchPad without deleting earlier sections.", code: runScratch }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Preserve the assignment-semantics experiment using real domain types.")],
    behavior: "ScratchPad demonstrates value copying and reference sharing without adding diagnostic-only production classes."
  },
  "9": {
    objective: "Add an isolated ScratchPad parameter-passing experiment without distorting a production repository API.",
    starting: "ScratchPad contains prior experiments and the student knows local methods. No TimeClock requirement currently needs ref, out, or in parameters.",
    steps: ["Add a Session 09 heading and keep all previous sections.", "Write one small method for ordinary by-value input, one Try-style out method, and one ref mutation.", "Predict caller-visible state before each call.", "Run the examples and annotate which changes cross the method boundary.", { text: "Run ScratchPad and build the production solution unchanged.", code: `${runScratch}\ndotnet build PinkMachine19.TimeClock.sln --configuration Release` }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Preserve parameter-passing observations outside production APIs.")],
    behavior: "ScratchPad demonstrates ref, out, in, and ordinary value passing; production contracts remain requirement-driven."
  },
  "10": {
    objective: "Add the production WorkSummary result model, then compare its value equality with ClockEntry identity in ScratchPad.",
    starting: "Production contains Employee, Address, and ClockEntry. The product needs a compact employee-hours result but does not have one yet.",
    steps: ["Create WorkSummary as an immutable record containing EmployeeId and Hours.", "Add a Session 10 ScratchPad section that creates two equal WorkSummary values and two separate ClockEntry objects.", "Predict == and Equals results before running.", "Add one string comparison with an explicit StringComparison choice.", { text: "Run ScratchPad, build, and test.", code: `${runScratch}\n${runAll}` }],
    expected: [f("src/PinkMachine19.TimeClock.Domain/WorkSummary.cs", "Add", "Represent a calculated employee-hours result."), f("src/PinkMachine19.TimeClock.ScratchPad/Program.cs", "Modify", "Compare equality semantics without adding production-only diagnostics.")],
    behavior: "WorkSummary becomes a real production result type, while ScratchPad preserves the equality comparison."
  },
  "11": {
    objective: "Create the first in-memory ClockEntryRepository using a private List<ClockEntry> required for saving and retrieving entries.",
    starting: "ClockEntry exists and can be completed. No production component stores more than one entry yet.",
    steps: ["Create ClockEntryRepository in Domain with a private List<ClockEntry>.", "Add Save to append an entry.", "Add methods to retrieve an employee's entries and locate an open entry.", "Update App to save open and completed entries and display the resulting count.", "Keep the list private; callers interact through repository behavior."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntryRepository.cs", "Add", "Store entries in memory."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Exercise repository collection behavior.")],
    behavior: "Production stores and retrieves clock entries through behavior rather than exposing its List."
  },
  "12": {
    objective: "Create an in-memory EmployeeRepository with dictionary lookup and deliberate name uniqueness.",
    starting: "Employee exists, and ClockEntryRepository demonstrates List storage. Employees still have no production lookup component.",
    steps: ["Create EmployeeRepository with Dictionary<int, Employee> for identity lookup.", "Use HashSet<string> with an explicit comparer to enforce the chosen name-uniqueness rule.", "Add employees and reject duplicate IDs or names with clear messages.", "Retrieve an employee by ID from App and print the result.", "Build and preserve the earlier clock-entry workflow."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/EmployeeRepository.cs", "Add", "Provide employee lookup and uniqueness."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Exercise employee storage.")],
    behavior: "Production has requirement-driven List, Dictionary, and HashSet use with no collection chosen merely for demonstration."
  },
  "13": {
    objective: "Narrow repository query results to IEnumerable<ClockEntry> so consumers depend on enumeration rather than storage details.",
    starting: "ClockEntryRepository stores entries in a private List and returns employee entries, while callers need only enumerate them.",
    steps: ["Change the employee-entry query contract to IEnumerable<ClockEntry>.", "Keep the private List implementation inside the repository.", "Update App to enumerate the returned sequence without casting it back to List.", "Explain which mutation capabilities disappeared from the caller's view.", "Build and run the existing workflow."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntryRepository.cs", "Modify", "Expose an enumeration contract."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Consume entries through IEnumerable.")],
    behavior: "Callers enumerate repository results without depending on List-specific mutation."
  },
  "14": {
    objective: "Preserve a generic-method experiment in ScratchPad because the production domain has no natural generic algorithm yet.",
    starting: "Production repositories and models exist. ScratchPad retains earlier language experiments; no verified requirement needs a custom generic type or method.",
    steps: ["Add a Session 14 section to ScratchPad.", "Write Later<T> once and call it with int and DateTime.", "Predict the selected value for each call.", "Keep the experiment isolated and document why it is not production code.", { text: "Run ScratchPad and leave production unchanged.", code: runScratch }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/GenericExperiments.cs", "Add", "Preserve a focused generic-method experiment.")],
    behavior: "One generic definition works for multiple types in ScratchPad; TimeClock production APIs remain non-generic until requirements demand otherwise."
  },
  "15": {
    objective: "Extend the permanent generic experiment with a constraint and observe exactly what the constraint enables.",
    starting: "Session 14 created ScratchPad's GenericExperiments with Later<T>. Production code is unchanged.",
    steps: ["Keep the Session 14 calls and add the IComparable<T> constraint.", "Use CompareTo inside Later<T> and confirm the constrained code builds.", "Temporarily remove the constraint and observe the compiler error, then restore it.", "Try a type without the required contract and record why it is rejected.", { text: "Run ScratchPad after restoring the valid constraint.", code: runScratch }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/GenericExperiments.cs", "Modify", "Extend rather than replace the generic notebook entry.")],
    behavior: "The preserved experiment shows that constraints grant safe operations and restrict callers."
  },
  "16": {
    objective: "Add a self-contained covariance and contravariance experiment to ScratchPad.",
    starting: "ScratchPad contains numeric, flow, method, parameter, equality, and generic experiments. No TimeClock production boundary benefits naturally from custom variance interfaces.",
    steps: ["Create VarianceExperiments.cs in ScratchPad.", "Define producer and consumer interfaces with out and in annotations.", "Write the allowed assignment directions and predict why they are safe.", "Keep reverse-direction examples commented with the compiler error they would cause.", { text: "Run ScratchPad and ensure earlier experiments still compile.", code: runScratch }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/VarianceExperiments.cs", "Add", "Preserve an isolated variance experiment.")],
    behavior: "Variance is observable without introducing artificial production abstractions."
  },
  "17": {
    objective: "Strengthen production encapsulation and create Timesheet composition from existing Employee and ClockEntry models.",
    starting: "Production repositories keep collections private, and Employee plus ClockEntry already model the core relationship. No Timesheet aggregate exists yet.",
    steps: ["Review repository fields and make any exposed mutable collection private.", "Create Timesheet with one Employee and a private collection of that employee's entries.", "Add an entry only when EmployeeId matches and expose a read-only view.", "Update App to compose a Timesheet and demonstrate rejection of a mismatched employee entry.", "Build without changing ScratchPad."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/Timesheet.cs", "Add", "Compose employee and entries around a real invariant."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryRepository.cs", "Modify", "Preserve collection encapsulation."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Exercise Timesheet composition.")],
    behavior: "Mutable collections remain encapsulated and Timesheet protects employee-entry ownership."
  },
  "18": {
    objective: "Introduce production repository and service interfaces where the application now has real collaborators to abstract.",
    starting: "EmployeeRepository, ClockEntryRepository, and the domain models exist as concrete production code. App currently coordinates them directly.",
    steps: ["Extract IEmployeeRepository and IClockEntryRepository from behavior App already uses.", "Make both in-memory repositories implement their contracts.", "Create ClockEntryService to coordinate clock-in and clock-out through IClockEntryRepository.", "Create EmployeeService only for verified employee lookup/registration behavior.", "Update App to depend on the interfaces and services, then build."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/IClockEntryRepository.cs", "Add", "Abstract entry persistence behavior."), f("src/PinkMachine19.TimeClock.Domain/IEmployeeRepository.cs", "Add", "Abstract employee persistence behavior."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryService.cs", "Add", "Coordinate clocking use cases."), f("src/PinkMachine19.TimeClock.Domain/EmployeeService.cs", "Add", "Coordinate employee use cases.")],
    behavior: "Interfaces are extracted from working production behavior, and services coordinate real use cases rather than demonstrating polymorphism artificially."
  },
  "19": {
    objective: "Teach inheritance and abstract members in ScratchPad because TimeClock has no verified requirement for a class hierarchy.",
    starting: "Production now uses interfaces for real variation. Forcing inheritance into those services would weaken the design, so this language comparison belongs in ScratchPad.",
    steps: ["Create InheritanceExperiments.cs in ScratchPad.", "Define one small abstract base type with one abstract and one concrete member.", "Create two derived types and observe inherited versus overridden behavior.", "Write a note comparing this closed hierarchy with the production interfaces from Session 18.", { text: "Run ScratchPad and build production unchanged.", code: `${runScratch}\ndotnet build PinkMachine19.TimeClock.sln --configuration Release` }],
    expected: [f("src/PinkMachine19.TimeClock.ScratchPad/InheritanceExperiments.cs", "Add", "Preserve inheritance syntax without inventing TimeClock policies.")],
    behavior: "The student learns inheritance through a permanent isolated comparison while production continues using natural interfaces."
  },
  "20": {
    objective: "Compose the production application with dependency injection and add PayrollService for the verified total-hours use case.",
    starting: "Production has models, repositories, repository interfaces, and clock-entry/employee services created in earlier sessions. App still constructs dependencies manually.",
    steps: ["Add the dependency-injection package to App if required.", "Create PayrollService to total completed entry durations for one employee and period.", "Register interfaces and concrete repositories/services with deliberate lifetimes.", "Resolve the application services in Program.cs and run one complete clock-in/clock-out/total workflow.", "Remove obsolete manual construction while preserving all prior production behavior."],
    expected: [f("src/PinkMachine19.TimeClock.Domain/PayrollService.cs", "Add", "Implement the verified total-hours use case."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Become the production composition root."), f("src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj", "Modify", "Reference DI support if needed.")],
    behavior: "App composes existing production abstractions and prints total completed hours through PayrollService."
  }
});

const q = (prompt, options, correct, explanation) => ({ prompt, options, correct, explanation });
const contentOverrides = {
  "2": {
    concept: [
      { title: "ProjectReference creates a compile-time dependency", paragraphs: ["dotnet add reference edits the consuming .csproj and adds one relative ProjectReference path. It does not copy source code or merge projects.", "App, Infrastructure, Web, ScratchPad, and Domain.Tests each consume Domain independently."], code: "dotnet add src/PinkMachine19.TimeClock.App/PinkMachine19.TimeClock.App.csproj reference src/PinkMachine19.TimeClock.Domain/PinkMachine19.TimeClock.Domain.csproj" },
      { title: "Dependency direction is a design decision", paragraphs: ["The CLI permits many reference directions, including poor ones. Domain stays independent because business rules should not depend on a console host, database technology, HTTP host, experiment notebook, or test runner.", "Each specific consumer points toward the general business layer."], code: "App ──────────▶ Domain\nInfrastructure ▶ Domain\nWeb ───────────▶ Domain\nScratchPad ────▶ Domain\nDomain.Tests ──▶ Domain" },
      { title: "Folders do not create dependencies", paragraphs: ["Projects can be siblings under src and still know nothing about one another. Only project references and package/framework references establish compile-time dependencies.", "The solution lists projects; it does not make every project reference every other project."] },
      { title: "ScratchPad is a consumer, never the product", paragraphs: ["ScratchPad references Domain so later experiments may use models the student already created. Domain and every production project remain unaware of ScratchPad.", "That one-way rule keeps notebook code from leaking into production."] }
    ]
  },
  "7": {
    concept: [
      { title: "Required state belongs in construction", paragraphs: ["Employee identity and ClockEntry clock-in time are required from the moment each object exists. Constructors make that requirement unavoidable.", "A nullable member should represent genuinely optional state, not unfinished initialization."], code: "public DateTime? ClockOut { get; private set; }" },
      { title: "Flow analysis follows the null check", paragraphs: ["Before clock-out, ClockOut is null. After a guard proves it has a value, the completed path can safely use ClockOut.Value.", "The compiler tracks that proof through the local control flow; it does not guess business intent."], code: "if (ClockOut is null)\n    throw new InvalidOperationException(\"The entry is still open.\");\n\nreturn ClockOut.Value - ClockIn;" },
      { title: "Invariants reject impossible transitions", paragraphs: ["Clock-out cannot precede clock-in, and a completed entry cannot be completed again. Those are ClockEntry rules, so ClockEntry protects them.", "Callers do not need to remember a fragile sequence of property assignments."], code: "if (clockOut < ClockIn)\n    throw new ArgumentOutOfRangeException(nameof(clockOut));" }
    ],
    preQuiz: [q("Which ClockEntry value is genuinely optional while an employee is still working?", ["EmployeeId", "ClockIn", "ClockOut"], 2, "An open entry has no clock-out time yet."), q("Where should the rule preventing a second clock-out live?", ["ClockEntry", "Program.cs formatting", "The solution file"], 0, "The model owns the state transition."), q("What does a null check give the compiler?", ["Proof for the checked control-flow path", "A database row", "A new project"], 0, "Nullable flow analysis follows explicit checks.")],
    postQuiz: [q("Why is ClockOut nullable?", ["Because every DateTime is nullable", "Because an open entry has not completed", "Because constructors cannot set properties"], 1, "Null represents a real open state."), q("What should GetDuration do for an open entry?", ["Return zero silently", "Reject the invalid request", "Set ClockOut automatically"], 1, "An open entry has no completed duration."), q("Why keep ClockOut's setter private?", ["So completion passes through the invariant-protecting method", "So tests cannot read it", "Because nullable properties must be private"], 0, "Controlled mutation protects valid state.")]
  },
  "9": {
    concept: [
      { title: "Ordinary parameters receive values", paragraphs: ["By default, a method receives a copy of the argument value. Reassigning the parameter does not replace the caller's variable.", "For a class variable, the copied value is a reference, so both sides can still observe mutation of the same object."], code: "static void Inspect(int value) { value = 99; }" },
      { title: "out returns an additional value", paragraphs: ["A Try-style method can return success as bool and place the found value in an out parameter.", "This is useful when absence is expected, but it should not be added to a production API unless callers genuinely need that shape."], code: "static bool TryRead(string text, out int value) =>\n    int.TryParse(text, out value);" },
      { title: "ref and in communicate special intent", paragraphs: ["ref permits the method to replace caller-visible storage. in passes by reference while preventing reassignment through that parameter.", "Both are specialized tools. ScratchPad lets you observe them without distorting TimeClock contracts."], code: "static void Increment(ref int value) => value++;" }
    ]
  },
  "18": {
    concept: [
      { title: "Extract contracts from behavior that exists", paragraphs: ["The repositories already save and retrieve production models, so their interfaces describe observed behavior instead of speculative architecture.", "A consumer depends on the contract; the composition root chooses the implementation."], code: "public interface IClockEntryRepository\n{\n    void Save(ClockEntry entry);\n    IEnumerable<ClockEntry> ForEmployee(int employeeId);\n}" },
      { title: "Services coordinate use cases", paragraphs: ["ClockEntry owns its state rules. ClockEntryService coordinates finding, creating, completing, and saving entries.", "That division keeps the model focused and persistence replaceable."], code: "public sealed class ClockEntryService(IClockEntryRepository entries)" },
      { title: "Polymorphism appears at the call site", paragraphs: ["The service can work with the in-memory repository today and an EF-backed repository later because both satisfy the same required behavior.", "No fictional policy hierarchy is needed to prove the point."], code: "IClockEntryRepository repository = new ClockEntryRepository();" }
    ]
  },
  "19": {
    concept: [
      { title: "Abstract classes combine requirements and shared code", paragraphs: ["An abstract member requires each derived type to provide behavior. A concrete member supplies shared behavior once.", "ScratchPad is appropriate because TimeClock's production variation is already modeled naturally with interfaces."], code: "abstract class Formatter\n{\n    public abstract string Format(string value);\n    protected static string Trim(string value) => value.Trim();\n}" },
      { title: "Derived types override required behavior", paragraphs: ["A derived class uses override to fulfill the abstract contract. It inherits concrete members without copying them.", "The hierarchy should represent a genuine is-a relationship, not a desire to reuse a few lines."], code: "sealed class UpperFormatter : Formatter\n{\n    public override string Format(string value) => Trim(value).ToUpperInvariant();\n}" },
      { title: "Interfaces and abstract classes solve different problems", paragraphs: ["Interfaces describe capabilities across otherwise unrelated implementations. Abstract classes model a related family that benefits from shared implementation.", "The production repository boundary needs substitution, not a shared base implementation, so it remains interface-based."] }
    ],
    preQuiz: [q("Why is this lesson in ScratchPad?", ["C# forbids inheritance in production", "TimeClock has no verified class-hierarchy requirement", "ScratchPad is always preferred"], 1, "Do not invent a hierarchy for the product."), q("Can an abstract class be instantiated directly?", ["Yes", "No", "Only by tests"], 1, "It is an incomplete base for derived types."), q("What must a concrete derived class do with an abstract member?", ["Override it", "Delete it", "Convert it to a field"], 0, "The override supplies the missing implementation.")],
    postQuiz: [q("When is an abstract class a good fit?", ["For a related family with shared implementation", "Whenever two classes have names", "For every repository"], 0, "Both relationship and shared behavior should be meaningful."), q("Why do repositories remain interface-based?", ["They need substitutable capabilities, not inherited implementation", "Interfaces run faster", "Abstract classes cannot have methods"], 0, "The design pressure is substitution across storage implementations."), q("What happens to the concrete helper on a derived class?", ["It is inherited", "It is deleted", "It becomes abstract automatically"], 0, "Concrete base behavior is inherited.")]
  }
};

Object.assign(contentOverrides, {
  "26": {
    concept: [
      { title: "Task represents work that may finish later", paragraphs: ["A Task is a handle to an operation's eventual completion, result, or failure. Returning Task does not automatically move work to another thread.", "Repository boundaries are a natural place for asynchronous APIs because later persistence may wait on external I/O."], code: "Task<ClockEntry?> FindOpenAsync(int employeeId, CancellationToken token);" },
      { title: "await preserves readable control flow", paragraphs: ["await pauses this method's continuation until the operation completes without blocking a thread just to wait.", "Exceptions and results flow through the await point, so each asynchronous call should be deliberately awaited or returned."], code: "ClockEntry? entry = await entries.FindOpenAsync(employeeId, token);" },
      { title: "Async must flow to the caller", paragraphs: ["Once a service awaits repository work, its caller also receives Task. The flow continues to App's top-level statements.", "The lab builds the chain correctly in one session; it does not intentionally introduce a fire-and-forget bug for a later lesson."], code: "await clockEntryService.ClockOutAsync(employeeId, token);" }
    ]
  },
  "27": {
    concept: [
      { title: "Sequential flow starts the next operation later", paragraphs: ["Awaiting one operation before creating the next is appropriate when order or dependency matters.", "The ScratchPad experiment uses controlled delays so start order is visible without changing production behavior."], code: "await LoadAsync(1);\nawait LoadAsync(2);" },
      { title: "Concurrent flow starts independent work together", paragraphs: ["Create both tasks first, then await Task.WhenAll when the operations are independent and safe to overlap.", "Concurrency is a design decision, not an automatic benefit of writing async."], code: "Task first = LoadAsync(1);\nTask second = LoadAsync(2);\nawait Task.WhenAll(first, second);" },
      { title: "Measure behavior, not wall-clock guesses", paragraphs: ["The experiment records starts and completions. Tests or controlled gates are more reliable than assuming a specific number of milliseconds.", "Production remains single-operation because no batch requirement exists yet."] }
    ]
  },
  "28": {
    concept: [
      { title: "Cancellation is a cooperative request", paragraphs: ["A CancellationToken carries a request to stop. Code at a cancellable boundary must observe it; adding a parameter without using or forwarding it changes nothing.", "Cancellation is not failure and should not be converted into an unrelated domain exception."], code: "token.ThrowIfCancellationRequested();" },
      { title: "Propagate the same token", paragraphs: ["App passes the token to the service, and the service passes it to the repository. Each layer should avoid replacing it with CancellationToken.None.", "The operation that waits on I/O is usually where cancellation becomes effective."], code: "await entries.FindOpenAsync(employeeId, token);" },
      { title: "Test cancellation deterministically", paragraphs: ["An already-cancelled token gives a deterministic first test. A second test proves normal work still succeeds.", "There is no need to preserve a known unawaited-call bug merely to teach cancellation."] }
    ]
  },
  "29": {
    concept: [
      { title: "Arrange creates only relevant state", paragraphs: ["Construct the entries and repository behavior the test needs. Deterministic timestamps keep the expected total obvious.", "Shared mutable setup makes failures harder to diagnose, so each test owns its arrangement."] },
      { title: "Act performs one behavior", paragraphs: ["The Act phase calls the behavior named by the test. If several unrelated actions are required, the test may be describing too much.", "Async tests await the operation rather than blocking on Result."], code: "decimal total = await service.CalculateTotalHoursAsync(employeeId, from, to);" },
      { title: "Assert checks an observable outcome", paragraphs: ["Assert the returned total or persisted state, not private implementation details.", "A failing assertion should explain which behavior changed."], code: "Assert.Equal(8m, total);" }
    ]
  },
  "30": {
    concept: [
      { title: "A test double replaces one collaborator", paragraphs: ["A hand-written fake is often clearest when it needs a small amount of state. A mocking library is useful when concise interaction configuration improves the test.", "Both implement production interfaces created earlier; neither requires production code to know about tests."] },
      { title: "Test behavior before interaction details", paragraphs: ["Prefer the result or state the caller cares about. Verify a collaboration call only when making that call is itself part of the contract.", "Over-specified mocks make harmless refactoring break tests."] },
      { title: "DI lifetimes describe reuse boundaries", paragraphs: ["Transient creates a new instance per resolution, Singleton reuses one container-wide instance, and Scoped reuses one instance inside a scope.", "Tests resolve the real registrations to confirm the composition root matches those decisions."] }
    ]
  },
  "34": {
    concept: [
      { title: "Validate at the HTTP boundary", paragraphs: ["Request validation rejects malformed or incomplete wire data before calling the domain service. Domain invariants still protect the model when callers bypass HTTP.", "The two layers answer different questions and should not duplicate every rule."] },
      { title: "Translate known failures consistently", paragraphs: ["A known conflict such as clocking in twice should become a deliberate status and error shape. Unexpected exceptions remain server failures and should be logged once at the boundary.", "Controllers should not contain duplicated try/catch blocks for every endpoint."] },
      { title: "Structured logs carry searchable context", paragraphs: ["Log named values such as EmployeeId and operation outcome rather than building one long string.", "Do not log secrets or turn expected validation failures into noisy stack traces."], code: "logger.LogInformation(\"Clock-in completed for employee {EmployeeId}\", employeeId);" }
    ]
  }
});

Object.assign(plans, {
  "21": { objective: "Extend PayrollService and repository queries with requirement-driven LINQ filtering, projection, and ordering.", starting: "The production workflow records entries and PayrollService totals completed hours. Query behavior is still expressed with basic loops or broad repository results.", steps: ["Add a query that selects completed entries for one employee and period.", "Use Where for business filtering, Select for the required shape, and OrderBy only where output order matters.", "Keep clock-entry state rules on ClockEntry rather than embedding them in query syntax.", "Update PayrollService to consume the query and preserve existing output.", "Build, run App, and test."], expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntryQueries.cs", "Add", "Centralize requirement-driven entry queries."), f("src/PinkMachine19.TimeClock.Domain/PayrollService.cs", "Modify", "Use the query pipeline.")], behavior: "Production uses LINQ to express existing filtering and ordering requirements without adding a second fictional feature." },
  "22": { objective: "Add the verified multi-employee work-summary report using grouping, joining, and aggregation.", starting: "WorkSummary, EmployeeRepository, ClockEntryRepository, and single-employee total-hours behavior already exist from earlier production sessions.", steps: ["Add a report method that groups completed entries by EmployeeId.", "Aggregate each group into WorkSummary.", "Join summaries with employees only when the output requires employee information.", "Define empty-entry behavior explicitly.", "Call the report from App and preserve the single-employee workflow."], expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntryAnalytics.cs", "Add", "Produce multi-employee summaries."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Display the report.")], behavior: "Production can report completed hours per employee using existing models and repositories." },
  "23": { objective: "Use permanent tests to prove deferred query behavior and materialized snapshot behavior.", starting: "Session 21 introduced production IEnumerable-based LINQ queries. The test project exists but contains only its template placeholder.", steps: ["Delete UnitTest1.cs and create DeferredExecutionTests.cs in Domain.Tests.", "Arrange a mutable source and build a query without enumerating it.", "Mutate the source, enumerate, and assert that deferred execution observes the change.", "Materialize a second query with ToList, mutate the source again, and assert the snapshot remains unchanged.", "Run the focused tests and then the full suite."], expected: [f("tests/PinkMachine19.TimeClock.Domain.Tests/UnitTest1.cs", "Delete", "Replace the template with meaningful verification."), f("tests/PinkMachine19.TimeClock.Domain.Tests/DeferredExecutionTests.cs", "Add", "Verify query timing through assertions.")], behavior: "Tests—not console output—prove deferred execution and snapshot independence." },
  "24": { objective: "Add precise production validation and domain exceptions, then verify invalid behavior with tests.", starting: "ClockEntry and services implement valid workflows. Invalid IDs, duplicate completion, and open-entry duration need consistent documented behavior.", steps: ["List each invalid condition and decide whether it is caller validation, a domain invariant, or an expected not-found result.", "Improve ClockEntry and service guards with precise exception types and messages.", "Do not catch exceptions merely to hide them.", "Add focused tests for each changed invalid path.", "Run App's valid workflow and the full test suite."], expected: [f("src/PinkMachine19.TimeClock.Domain/ClockEntry.cs", "Modify", "Enforce domain invariants."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryService.cs", "Modify", "Handle expected collaboration outcomes."), f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntryValidationTests.cs", "Add", "Verify invalid behavior.")], behavior: "Valid workflows remain unchanged, invalid states fail precisely, and tests document the contract." },
  "25": { objective: "Trace production exception propagation and preserve a separate ScratchPad resource-cleanup experiment.", starting: "Session 24 added tested production exceptions. No TimeClock resource currently requires a custom IDisposable implementation.", steps: ["Trace one ClockEntry exception from model through service to App and decide where it should be translated or displayed.", "Add only the production catch that provides a real application boundary response; preserve the original exception context.", "Create ResourceExperiments.cs in ScratchPad with a small IDisposable probe and a deliberate exception inside using.", "Verify cleanup occurs and keep the experiment permanently.", "Run App, ScratchPad, and tests."], expected: [f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Handle a domain failure at the application boundary."), f("src/PinkMachine19.TimeClock.ScratchPad/ResourceExperiments.cs", "Add", "Demonstrate guaranteed cleanup without fake production resources.")], behavior: "Production reports a real domain failure appropriately, while ScratchPad proves using cleanup in isolation." },
  "26": { objective: "Make repository and clock-out operations asynchronous from implementation through App.", starting: "Repositories and services are synchronous and working. Persistence boundaries are now clear enough to introduce Task and await without pretending CPU work is asynchronous.", steps: ["Change repository operations that represent external persistence boundaries to return Task.", "Propagate async through ClockEntryService and PayrollService only where they await that work.", "Update App's top-level flow to await service calls.", "Avoid Task.Run around synchronous domain calculations.", "Build with no unawaited-call warnings and run tests."], expected: [f("src/PinkMachine19.TimeClock.Domain/IClockEntryRepository.cs", "Modify", "Expose asynchronous persistence boundaries."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryRepository.cs", "Modify", "Implement the async contract."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryService.cs", "Modify", "Await repository work."), f("src/PinkMachine19.TimeClock.App/Program.cs", "Modify", "Await the production workflow.")], behavior: "Async flows end to end at genuine persistence boundaries, and App contains no fire-and-forget service call." },
  "27": { objective: "Compare sequential and concurrent asynchronous flow in ScratchPad without adding an unrequired batch loader to production.", starting: "Production uses async for repository boundaries. The product has no verified requirement to batch-load entries concurrently.", steps: ["Create AsyncFlowExperiments.cs in ScratchPad.", "Use two controlled delayed operations and record start/completion order.", "Run them sequentially with two awaits, then concurrently with Task.WhenAll.", "Predict order and elapsed behavior before each run.", "Preserve the experiment and leave production APIs unchanged."], expected: [f("src/PinkMachine19.TimeClock.ScratchPad/AsyncFlowExperiments.cs", "Add", "Preserve the concurrency comparison outside production.")], behavior: "ScratchPad demonstrates sequencing versus concurrency without fictional TimeClock batching." },
  "28": { objective: "Propagate cancellation through the real asynchronous repository and service workflow.", starting: "Session 26 established awaited repository/service flow. Those methods do not yet accept or observe cancellation.", steps: ["Add CancellationToken to asynchronous repository contracts and implementations.", "Pass the token through ClockEntryService and any asynchronous App workflow.", "Observe cancellation at the operation that can actually stop work.", "Add tests for an already-cancelled token and normal completion.", "Run App and the full test suite."], expected: [f("src/PinkMachine19.TimeClock.Domain/IClockEntryRepository.cs", "Modify", "Accept cancellation."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryRepository.cs", "Modify", "Observe cancellation."), f("src/PinkMachine19.TimeClock.Domain/ClockEntryService.cs", "Modify", "Propagate cancellation."), f("tests/PinkMachine19.TimeClock.Domain.Tests/CancellationTests.cs", "Add", "Verify cancellation behavior.")], behavior: "Cancellation is meaningful, propagated, and tested rather than decorative." },
  "29": { objective: "Organize the permanent test suite around Arrange–Act–Assert and add missing PayrollService behavior coverage.", starting: "Earlier sessions added focused tests when assertions were the natural verification tool. This session names and standardizes the testing practice already in use.", steps: ["Create ClockEntryTests and identify its Arrange, Act, and Assert responsibilities without adding noisy comments.", "Create PayrollServiceTests for completed entries, open entries, and no entries.", "Use deterministic dates and avoid sharing mutable fixtures between tests.", "Run focused tests, intentionally break one expectation, observe the failure, and restore it.", "Run the full suite."], expected: [f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntryTests.cs", "Add", "Verify core ClockEntry behavior with AAA."), f("tests/PinkMachine19.TimeClock.Domain.Tests/PayrollServiceTests.cs", "Add", "Verify total-hours behavior.")], behavior: "The permanent suite communicates behavior through independent AAA tests and covers PayrollService boundaries." },
  "30": { objective: "Test production collaborations with hand-written and library test doubles, then verify DI lifetimes.", starting: "Repository interfaces, services, DI registrations, and a permanent test suite all exist from prior sessions.", steps: ["Reference App from Domain.Tests so tests can verify the composition root.", "Create a recording IClockEntryRepository fake for one ClockEntryService interaction test.", "Use a mocking library only where interaction configuration is clearer than a hand-written fake.", "Test Transient, Singleton, and Scoped registrations through the production composition method.", "Keep tests focused on observable behavior, then run the full suite."], expected: [f("tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj", "Modify", "Reference App for composition-root tests."), f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntryServiceTests.cs", "Add", "Verify service collaboration."), f("src/PinkMachine19.TimeClock.App/ServiceRegistration.cs", "Add", "Expose production registrations for verification."), f("tests/PinkMachine19.TimeClock.Domain.Tests/ServiceRegistrationTests.cs", "Add", "Verify DI lifetimes.")], behavior: "Tests use the smallest useful double and prove the production DI composition behaves as intended." },
  "31": { objective: "Add EF Core persistence to Infrastructure without moving storage concerns into Domain.", starting: "Domain repository contracts and in-memory implementations are complete. Infrastructure references Domain but still contains only its template placeholder.", steps: ["Delete Infrastructure/Class1.cs, add EF Core packages to Infrastructure, add SQLite support to Domain.Tests, and reference Infrastructure from Domain.Tests.", "Create TimeClockDbContext and a persistence entity shaped for storage.", "Create mapping between the persistence entity and Domain ClockEntry rather than adding EF attributes to Domain.", "Implement an EF-backed repository behind the existing Domain contract.", "Add an in-memory SQLite test for Added and persisted states."], expected: [f("src/PinkMachine19.TimeClock.Infrastructure/Class1.cs", "Delete", "Remove the infrastructure template placeholder."), f("src/PinkMachine19.TimeClock.Infrastructure/PinkMachine19.TimeClock.Infrastructure.csproj", "Modify", "Add EF Core packages."), f("tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj", "Modify", "Reference Infrastructure and add SQLite test support."), f("src/PinkMachine19.TimeClock.Infrastructure/TimeClockDbContext.cs", "Add", "Define EF persistence."), f("src/PinkMachine19.TimeClock.Infrastructure/ClockEntryEntity.cs", "Add", "Represent stored clock entries."), f("src/PinkMachine19.TimeClock.Infrastructure/EfClockEntryRepository.cs", "Add", "Implement the domain repository contract."), f("tests/PinkMachine19.TimeClock.Domain.Tests/TimeClockDbContextTests.cs", "Add", "Verify persistence.")], behavior: "Infrastructure persists entries through EF Core while Domain remains storage-agnostic." },
  "32": { objective: "Add provider-executed EF Core queries and verify them against SQLite.", starting: "Session 31 created TimeClockDbContext, entity mapping, and an EF-backed repository with integration-test infrastructure.", steps: ["Build IQueryable filters for employee, completion state, and period before materialization.", "Use async materialization at the database boundary.", "Avoid invoking non-translatable domain methods inside the provider query.", "Add SQLite integration tests that distinguish query construction from execution.", "Run focused integration tests and the full suite."], expected: [f("src/PinkMachine19.TimeClock.Infrastructure/ClockEntryDataQueries.cs", "Add", "Define provider-compatible queries."), f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntryDataQueriesTests.cs", "Add", "Verify database execution.")], behavior: "Filtering executes through SQLite with provider-compatible expressions and tested results." },
  "33": { objective: "Create the first HTTP clock-entry endpoint over the production services and explicit wire contracts.", starting: "Domain and Infrastructure support the complete clock-entry workflow. Web is still its scaffolded host with no TimeClock endpoint.", steps: ["Reference Infrastructure from Web and register controllers plus the complete production service graph.", "Create ClockInRequest and ClockEntryResponse contracts without exposing persistence entities.", "Create ClockEntriesController with one route backed by ClockEntryService.", "Map controllers and run the Web project.", "Send one HTTP request and verify the response shape."], expected: [f("src/PinkMachine19.TimeClock.Web/PinkMachine19.TimeClock.Web.csproj", "Modify", "Reference Infrastructure for composition."), f("src/PinkMachine19.TimeClock.Web/Requests/ClockInRequest.cs", "Add", "Define incoming data."), f("src/PinkMachine19.TimeClock.Web/Responses/ClockEntryResponse.cs", "Add", "Define outgoing data."), f("src/PinkMachine19.TimeClock.Web/Controllers/ClockEntriesController.cs", "Add", "Expose the clock-in use case."), f("src/PinkMachine19.TimeClock.Web/Program.cs", "Modify", "Compose and route the web application.")], behavior: "A real HTTP request reaches production service behavior and returns a deliberate response contract." },
  "34": { objective: "Add API validation, structured logging, and consistent error responses around the existing endpoint.", starting: "Session 33 created a working clock-entry endpoint and complete service registration. Invalid requests still lack a deliberate HTTP contract.", steps: ["Reference Web from Domain.Tests so the permanent suite can host integration tests.", "Add request validation for actual clock-in input requirements.", "Translate known domain failures to consistent API error responses at the Web boundary.", "Add structured logs with stable event context and no sensitive data.", "Add Web integration tests for success, validation failure, and domain conflict, then run the full suite."], expected: [f("tests/PinkMachine19.TimeClock.Domain.Tests/PinkMachine19.TimeClock.Domain.Tests.csproj", "Modify", "Reference Web for integration testing."), f("src/PinkMachine19.TimeClock.Web/Validators/ClockInRequestValidator.cs", "Add", "Validate request input."), f("src/PinkMachine19.TimeClock.Web/Program.cs", "Modify", "Configure errors and logging."), f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntriesApiTests.cs", "Add", "Verify HTTP behavior.")], behavior: "The endpoint returns predictable success and error contracts and emits structured diagnostic logs." },
  "35": { objective: "Complete and verify the end-to-end record-completed-entry workflow built across the curriculum.", starting: "Sessions 01–34 cumulatively created the solution, domain, services, tests, persistence, async flow, cancellation, and HTTP boundary. No prebuilt production artifact is assumed.", steps: ["Trace one clock-in and clock-out request across Web, service, repository, EF Core, and Domain.", "Fill only genuine integration gaps discovered by the trace.", "Add an end-to-end test that records, completes, persists, queries, and summarizes one entry.", "Run App and Web smoke checks plus the complete test suite.", "Review the build sequence and identify the session that created every file touched by the workflow."], expected: [f("tests/PinkMachine19.TimeClock.Domain.Tests/ClockEntryWorkflowTests.cs", "Add", "Verify the complete workflow."), f("src/PinkMachine19.TimeClock.Infrastructure/ClockEntryWorkflow.cs", "Add", "Coordinate persistence only if the existing service boundary requires it.")], behavior: "The application built from Session 01 works end to end, and the final test proves the same artifacts the student created throughout the course."
  }
});

for (const [number, plan] of Object.entries(plans)) {
  const padded = number.includes(".") ? number : number.padStart(2, "0");
  const file = path.join(sessionsDir, `session-${padded}.json`);
  const session = JSON.parse(await readFile(file, "utf8"));
  const build = sequenceByNumber.get(number);
  session.learningEnvironment = build.environment;
  session.buildState = {
    creates: build.creates || [],
    extends: build.extends || []
  };
  session.lab.objective = plan.objective;
  session.connection = `${plan.starting} ${plan.objective}`;
  session.lab.startingCondition = plan.starting;
  if (plan.preserveStructuredLabs && session.lab.labs) {
    delete session.lab.steps;
  } else {
    session.lab.steps = plan.steps;
    delete session.lab.labs;
  }
  session.lab.expectedBehavior = plan.behavior;
  session.lab.validation = plan.validation || (build.environment === "scratchpad" ? `${runScratch} && dotnet build PinkMachine19.TimeClock.sln --configuration Release` : runAll);
  session.expectedFiles = [...plan.expected, f(`site/data/sessions/session-${padded}.json`, "Modify", "Keep the lesson synchronized with the cumulative build step.")];
  session.review = [
    `The lab uses ${build.environment} because that is the most natural environment for this concept.`,
    "Every referenced application artifact was created in this session or an earlier session.",
    "Earlier production code, tests, and ScratchPad experiments remain intact.",
    ...session.review.filter((item) => !/scratch solution|real repository|already exist|The lab uses|Every referenced|Earlier production/i.test(item)).slice(0, 4)
  ];
  if (contentOverrides[number]) Object.assign(session, contentOverrides[number]);
  if (number === "1") {
    session.objectives = session.objectives.map((item) => item.replace("all five TimeClock projects", "all six permanent projects"));
    session.concept[0].paragraphs[1] = "A .sln file is a manifest of project paths. By the end of this lab it lists Domain, App, Infrastructure, Web, ScratchPad, and Domain.Tests so one build or test command can act on the complete learner workspace.";
    session.concept[1].title = "Four templates, six permanent projects";
    session.concept[1].paragraphs = [
      "dotnet new console creates a runnable project. App is the production console host; ScratchPad is a second console project used only as the permanent learning notebook.",
      "dotnet new classlib creates Domain and Infrastructure because neither runs by itself. dotnet new web creates the HTTP host. dotnet new xunit creates the permanent test project.",
      "The lab creates all six projects. ScratchPad is never deleted, and production projects never reference it."
    ];
  }
  sanitizeProvenance(session);
  await writeFile(file, `${JSON.stringify(session, null, 2)}\n`);
}

for (const number of ["0", "00.5", "00.6"]) {
  const padded = number === "0" ? "00" : number;
  const file = path.join(sessionsDir, `session-${padded}.json`);
  const session = JSON.parse(await readFile(file, "utf8"));
  const build = sequenceByNumber.get(number);
  session.learningEnvironment = build.environment;
  session.buildState = { creates: build.creates || [], extends: build.extends || [] };
  await writeFile(file, `${JSON.stringify(session, null, 2)}\n`);
}

console.log(`Applied zero-to-N plans to ${Object.keys(plans).length} sessions.`);

function sanitizeProvenance(value) {
  if (typeof value === "string") {
    return value
      .replaceAll("Parm.Practice.ConsoleApplication", "the cumulative TimeClock application")
      .replaceAll("Parm.Practice.WebApi", "the TimeClock Web project")
      .replace(/practice-07092026(?: source)?/gi, "cumulative learner solution")
      .replace(/real source repository/gi, "production code")
      .replace(/source repository/gi, "learner solution")
      .replace(/real repository/gi, "learner solution")
      .replace(/real source/gi, "production code")
      .replace(/mirrors the real/gi, "matches the current")
      .replace(/matching the real/gi, "matching the current")
      .replace(/source syllabus/gi, "course requirements")
      .replace(/step-?0?46/gi, "the requirement review");
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) value[index] = sanitizeProvenance(value[index]);
    return value;
  }
  if (!value || typeof value !== "object") return value;
  for (const [key, item] of Object.entries(value)) {
    value[key] = sanitizeProvenance(item);
  }
  return value;
}
