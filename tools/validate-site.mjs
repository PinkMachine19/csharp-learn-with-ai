import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = process.env.COURSE_OUTPUT_DIR
  ? path.resolve(root, process.env.COURSE_OUTPUT_DIR)
  : path.join(root, "site", "dist");
const errors = [];
const requiredRoutes = ["index.html", "syllabus/index.html", "sessions/index.html", "quizzes/index.html", "labs/index.html", "404.html"];
const requiredNav = ["Home", "Syllabus", "Sessions", "Quizzes", "Labs"];
const forbidden = [
  /C:\\Users\\/i,
  /\/Users\//i,
  /coding assessment/i,
  /job application/i,
  /recruiter/i,
  /employer/i,
  /interview/i,
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
  const { sessions, course, layers } = manifest;
  if (sessions.length !== course.sessionCount) errors.push(`Manifest count ${sessions.length} does not match course count ${course.sessionCount}`);
  if (new Set(sessions.map((session) => session.id)).size !== sessions.length) errors.push("Duplicate session IDs exist");
  if (new Set(sessions.map((session) => session.slug)).size !== sessions.length) errors.push("Duplicate session slugs exist");
  if (layers.length !== 9) errors.push(`Expected 9 curriculum layers, found ${layers.length}`);
  for (const [index, session] of sessions.entries()) {
    const expected = index + 1;
    if (session.number !== expected) errors.push(`Session sequence breaks at ${session.id}`);
    if (session.prerequisiteSession !== (expected === 1 ? null : expected - 1)) errors.push(`Unexpected prerequisite for ${session.id}`);
    for (const field of ["lessonPath", "labPath", "quizPath", "validationCommand", "suggestedCommitMessage", "migrationSource", "completionStatus"]) {
      if (!session[field]) errors.push(`${session.id} is missing ${field}`);
    }
    if (!Array.isArray(session.filesExpectedToChange)) errors.push(`${session.id} filesExpectedToChange must be an array`);
    if (session.completionStatus === "complete") {
      for (const field of ["lessonPath", "labPath", "quizPath"]) {
        try { await access(path.join(dist, session[field])); }
        catch { errors.push(`${session.id} completed ${field} does not exist`); }
      }
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
    const local = href.slice(manifest.course.basePath.length);
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
for (const session of manifest.sessions.filter((item) => item.completionStatus === "complete")) {
  const lesson = await readFile(path.join(dist, session.lessonPath), "utf8");
  for (const heading of requiredLessonHeadings) if (!lesson.includes(`>${heading}</h2>`)) errors.push(`${session.id} is missing section: ${heading}`);
  const svgCount = (lesson.match(/<svg /g) || []).length;
  if (svgCount < 4 || svgCount > 8) errors.push(`${session.id} must contain 4–8 opening SVGs; found ${svgCount}`);
  if (!lesson.includes('aria-label="Session navigation"')) errors.push(`${session.id} is missing session navigation`);
  if (!lesson.includes(session.suggestedCommitMessage)) errors.push(`${session.id} commit checkpoint does not match the manifest`);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML pages and ${manifest.sessions.length} manifest sessions.`);
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
