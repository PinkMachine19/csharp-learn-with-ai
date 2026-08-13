import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = process.env.COURSE_OUTPUT_DIR
  ? path.resolve(root, process.env.COURSE_OUTPUT_DIR)
  : path.join(root, "site", "dist");
const errors = [];
const buildSequence = JSON.parse(await readFile(path.join(root, "site", "data", "build-sequence.json"), "utf8"));
const sequenceByNumber = new Map(buildSequence.sessions.map((item) => [String(item.number), item]));
const requiredRoutes = ["index.html", "syllabus/index.html", "sessions/index.html", "quizzes/index.html", "labs/index.html", "404.html"];
const requiredNav = ["Home", "Syllabus", "Sessions", "Quizzes", "Labs"];
const forbidden = [
  /C:\\Users\\/i,
  /\/Users\//i,
  /coding assessment/i,
  /job application/i,
  /recruiter/i,
  /employer/i,
  /coderpad/i,
  /my interview/i,
  /for the interview/i,
  /what they might ask/i,
  /as an ai/i,
  /we need to add this later/i,
  /â€”|â€“|â€™|â€œ|â€/
];

for (const route of requiredRoutes) {
  try { await access(path.join(dist, route)); }
  catch { errors.push(`Missing required route: ${route}`); }
}

const manifestPath = path.join(dist, "course-manifest.json");
let manifest;
try { manifest = JSON.parse(await readFile(manifestPath, "utf8")); }
catch (error) { errors.push(`Manifest is missing or invalid: ${error.message}`); }

if (manifest) {
  const { sessions, refreshers = [], sideLabs = [], course, layers } = manifest;
  if (sessions.length !== course.sessionCount) errors.push(`Manifest count ${sessions.length} does not match course count ${course.sessionCount}`);
  if (new Set(sessions.map((session) => session.id)).size !== sessions.length) errors.push("Duplicate session IDs exist");
  if (new Set(sessions.map((session) => session.slug)).size !== sessions.length) errors.push("Duplicate session slugs exist");
  if (layers.length !== 10) errors.push(`Expected 10 curriculum layers, found ${layers.length}`);
  const expectedNumbers = [0, "00.5", "00.6", 1, 2, 3, "03.5", ...Array.from({ length: 32 }, (_, index) => index + 4)];
  for (const [index, session] of sessions.entries()) {
    if (session.number !== expectedNumbers[index]) errors.push(`Session sequence breaks at ${session.id}`);
    const expectedPrerequisite = index === 0 ? null : sessions[index - 1].number;
    if (session.prerequisiteSession !== expectedPrerequisite) errors.push(`Unexpected prerequisite for ${session.id}`);
    for (const field of ["lessonPath", "labPath", "quizPath", "validationCommand", "suggestedCommitMessage", "migrationSource", "completionStatus"]) {
      if (!session[field]) errors.push(`${session.id} is missing ${field}`);
    }
    if (!Array.isArray(session.filesExpectedToChange)) errors.push(`${session.id} filesExpectedToChange must be an array`);
    const expectedBuildStep = sequenceByNumber.get(String(session.number));
    if (!expectedBuildStep) errors.push(`${session.id} has no cumulative build-sequence entry`);
    if (session.learningEnvironment !== expectedBuildStep?.environment) errors.push(`${session.id} has the wrong learning environment`);
    if (!session.buildState || (!Array.isArray(session.buildState.creates) && !Array.isArray(session.buildState.extends))) errors.push(`${session.id} has no cumulative build state`);
    if (session.completionStatus === "complete") {
      for (const field of ["lessonPath", "labPath", "quizPath"]) {
        try { await access(path.join(dist, session[field])); }
        catch { errors.push(`${session.id} completed ${field} does not exist`); }
      }
    }
  }
  if (refreshers.length !== course.refresherCount) errors.push(`Refresher count ${refreshers.length} does not match course count ${course.refresherCount}`);
  const expectedRefreshers = ["R1", "R2", "R3", "R4", "R5"];
  for (const [index, refresher] of refreshers.entries()) {
    if (refresher.number !== expectedRefreshers[index]) errors.push(`Refresher sequence breaks at ${refresher.id}`);
    if (refresher.prerequisiteSession !== null) errors.push(`${refresher.id} must remain independently startable`);
    for (const field of ["lessonPath", "labPath", "quizPath", "suggestedCommitMessage", "completionStatus"]) {
      if (!refresher[field]) errors.push(`${refresher.id} is missing ${field}`);
    }
    for (const field of ["lessonPath", "labPath", "quizPath"]) {
      try { await access(path.join(dist, refresher[field])); }
      catch { errors.push(`${refresher.id} ${field} does not exist`); }
    }
  }
  if (sideLabs.length !== course.sideLabCount) errors.push(`Side-lab count ${sideLabs.length} does not match course count ${course.sideLabCount}`);
  for (const sideLab of sideLabs) {
    if (!sideLab.isSideLab || !sideLab.isSupplemental) errors.push(`${sideLab.id} is not marked as an optional side lab`);
    if (!sessions.some((session) => session.number === sideLab.attachedToSession)) errors.push(`${sideLab.id} is attached to a missing session`);
    for (const field of ["lessonPath", "labPath", "quizPath", "suggestedCommitMessage", "completionStatus"]) {
      if (!sideLab[field]) errors.push(`${sideLab.id} is missing ${field}`);
    }
    for (const field of ["lessonPath", "labPath", "quizPath"]) {
      try { await access(path.join(dist, sideLab[field])); }
      catch { errors.push(`${sideLab.id} ${field} does not exist`); }
    }
  }
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const relative = path.relative(dist, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  if (!html.includes('<html lang="en">')) errors.push(`${relative} has no English language declaration`);
  if (!html.includes('class="skip-link"')) errors.push(`${relative} has no skip link`);
  if (!html.includes('aria-label="Primary navigation"')) errors.push(`${relative} has no labeled primary navigation`);
  for (const label of requiredNav) if (!html.includes(`>${label}</a>`)) errors.push(`${relative} navigation is missing ${label}`);
  for (const pattern of forbidden) if (pattern.test(html)) errors.push(`${relative} contains forbidden learner-facing content: ${pattern}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${relative} contains duplicate HTML IDs`);
  for (const href of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1])) {
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    if (!href.startsWith(manifest.course.basePath)) errors.push(`${relative} asset/link does not honor base path: ${href}`);
    const local = href.slice(manifest.course.basePath.length).split(/[?#]/, 1)[0];
    const target = local.endsWith("/") ? `${local}index.html` : local;
    try { await access(path.join(dist, target)); }
    catch { errors.push(`${relative} has broken internal reference: ${href}`); }
  }
  for (const svg of html.match(/<svg[\s\S]*?<\/svg>/g) || []) {
    if (!/role="img"/.test(svg) || !/<title/.test(svg) || !/<desc/.test(svg)) errors.push(`${relative} contains an inaccessible SVG`);
  }
}

const quizPage = await readFile(path.join(dist, "quizzes", "index.html"), "utf8");
const homePage = await readFile(path.join(dist, "index.html"), "utf8");
if (!homePage.includes("Syllabus | C#/.NET Learn with AI")) errors.push("Home page no longer serves the syllabus as the site root");
if (!quizPage.includes("data-check-answer") || !quizPage.includes('role="status"')) errors.push("Quiz interaction contract is incomplete");
if (!quizPage.includes("reveal-card") || !quizPage.includes('aria-expanded="false"')) errors.push("Reveal interaction contract is incomplete");
const script = await readFile(path.join(dist, "assets", "app.js"), "utf8");
if (!script.includes("dataset.correct") || !script.includes("aria-expanded")) errors.push("Interaction JavaScript is incomplete");

const requiredLessonHeadings = [
  "1. Learning Objectives", "2. Pre-Coding Quiz", "3. The Concept", "4. Lab",
  "5. Expected Files Changed", "6. Commit Checkpoint", "7. Code Review Checklist",
  "8. Post-Coding Quiz", "9. Reflection Questions", "10. What Breaks If This Code Is Removed?",
  "11. What C#/.NET Concept Was Learned Today?"
];
for (const session of [...manifest.sessions, ...(manifest.sideLabs || []), ...(manifest.refreshers || [])].filter((item) => item.completionStatus === "complete")) {
  const lesson = await readFile(path.join(dist, session.lessonPath), "utf8");
  for (const heading of requiredLessonHeadings) if (!lesson.includes(`>${heading}</h2>`)) errors.push(`${session.id} is missing section: ${heading}`);
  const svgCount = (lesson.match(/<svg /g) || []).length;
  if (svgCount < 4 || svgCount > 8) errors.push(`${session.id} must contain 4–8 opening SVGs; found ${svgCount}`);
  if (!lesson.includes('aria-label="Session navigation"')) errors.push(`${session.id} is missing session navigation`);
  if (!session.isSupplemental && !lesson.includes('class="build-state"')) errors.push(`${session.id} is missing its cumulative build-state banner`);
  if (!lesson.includes(session.suggestedCommitMessage)) errors.push(`${session.id} commit checkpoint does not match the manifest`);
}

const allowedEnvironments = new Set(["documentation", "solution", "production", "tests", "scratchpad", "mixed"]);
const cumulativeFiles = new Set();
for (const session of manifest.sessions) {
  if (!allowedEnvironments.has(session.learningEnvironment)) errors.push(`${session.id} uses an unknown learning environment`);
  const source = JSON.parse(await readFile(path.join(root, "site", "data", "sessions", `${session.id}.json`), "utf8"));
  if (Number(session.number) >= 1 && Number(session.number) <= 24) {
    const lesson = await readFile(path.join(dist, session.lessonPath), "utf8");
    const standaloneLab = await readFile(path.join(dist, session.labPath), "utf8");
    const stepTotals = source.lab.labs
      ? source.lab.labs.map((lab) => lab.instructions.length)
      : [source.lab.steps.length];
    for (const total of stepTotals) {
      for (let index = 1; index <= total; index++) {
        const label = `Step ${index}/${total}`;
        if (!lesson.includes(label)) errors.push(`${session.id} lesson is missing ${label}`);
        if (!standaloneLab.includes(label)) errors.push(`${session.id} standalone lab is missing ${label}`);
      }
    }
  }
  const serializedLab = JSON.stringify(source.lab);
  if (/completed reference implementation|temporary scratch|scratch folder outside|pre-?built application/i.test(serializedLab)) errors.push(`${session.id} reintroduces a prebuilt or disposable-workspace assumption`);
  const changedPaths = source.expectedFiles.map((item) => item.path);
  if (session.learningEnvironment === "scratchpad" && changedPaths.some((item) => /src\/PinkMachine19\.TimeClock\.(?!ScratchPad)/.test(item))) errors.push(`${session.id} is ScratchPad-only but changes production source`);
  if (session.learningEnvironment === "production" && changedPaths.some((item) => /ScratchPad/.test(item))) errors.push(`${session.id} is production-only but changes ScratchPad`);
  for (const file of source.expectedFiles.filter((item) => /^(?:src|tests)\//.test(item.path) || item.path.endsWith(".sln"))) {
    const action = file.action.toLowerCase();
    if (action === "add") {
      if (cumulativeFiles.has(file.path)) errors.push(`${session.id} adds ${file.path}, but an earlier session already created it`);
      cumulativeFiles.add(file.path);
    } else if (action === "modify" || action === "delete") {
      if (!cumulativeFiles.has(file.path)) errors.push(`${session.id} ${action}s ${file.path}, but no earlier session created it`);
      if (action === "delete") cumulativeFiles.delete(file.path);
    }
  }
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML pages, ${manifest.sessions.length} primary sessions, ${(manifest.sideLabs || []).length} optional side labs, and ${(manifest.refreshers || []).length} optional refreshers.`);
  console.log(`Base path verified: ${manifest.course.basePath}`);
  console.log("Navigation, interactions, SVG accessibility, content policy, and internal references passed.");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  }));
  return nested.flat();
}
