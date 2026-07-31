import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const dist = process.env.COURSE_OUTPUT_DIR
  ? path.resolve(root, process.env.COURSE_OUTPUT_DIR)
  : path.join(site, "dist");
const raw = JSON.parse(await readFile(path.join(site, "data", "course-manifest.json"), "utf8"));
const basePath = normalizeBase(process.env.COURSE_BASE_PATH || raw.course.basePath);
const layersById = new Map(raw.layers.map((layer) => [layer.id, layer]));
const sessions = raw.sessions.map(([number, slug, title, layerId, prerequisite, migrationSource]) => {
  const padded = String(number).padStart(2, "0");
  return {
    number,
    id: `session-${padded}`,
    slug,
    title,
    curriculumLayer: layersById.get(layerId).title,
    layerId,
    prerequisiteSession: prerequisite,
    lessonPath: `sessions/session-${padded}/index.html`,
    labPath: `labs/session-${padded}.html`,
    quizPath: `quizzes/session-${padded}.html`,
    filesExpectedToChange: [],
    validationCommand: "npm test",
    suggestedCommitMessage: `session-${padded}: ${title.toLowerCase()}`,
    migrationSource: `source steps ${migrationSource}`,
    completionStatus: "planned"
  };
});
const manifest = { ...raw, course: { ...raw.course, basePath }, sessions };

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(site, "assets"), path.join(dist, "assets"), { recursive: true });

const home = page({
  title: raw.course.title,
  active: "home",
  description: raw.course.subtitle,
  body: `
    <main id="main-content">
      <section class="hero shell">
        <div class="hero-copy">
          <p class="eyebrow">A documentation-first learning path</p>
          <h1>Build a dependable mental model of <span>C# and .NET</span>.</h1>
          <p class="lede">Refresh practical skills through visual explanations, prediction, focused coding, review, tests, and incremental commits.</p>
          <div class="hero-actions">
            <a class="button primary" href="${url("syllabus/")}">Explore the syllabus</a>
            <a class="button secondary" href="${url("sessions/")}">View all 34 sessions</a>
          </div>
          <dl class="hero-stats" aria-label="Course at a glance">
            <div><dt>34</dt><dd>focused sessions</dd></div>
            <div><dt>9</dt><dd>curriculum layers</dd></div>
            <div><dt>80%</dt><dd>quiz threshold</dd></div>
          </dl>
        </div>
        <div class="hero-model" aria-labelledby="loop-title">
          <p class="model-kicker">The learning loop</p>
          <h2 id="loop-title">Predict. Build. Explain.</h2>
          <svg viewBox="0 0 560 360" role="img" aria-labelledby="loop-svg-title loop-svg-desc">
            <title id="loop-svg-title">The course learning loop</title>
            <desc id="loop-svg-desc">A circular flow connects predict, observe, build, verify, and explain, returning to prediction.</desc>
            <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" /></marker></defs>
            <path class="loop-path" d="M165 75 C300 5 445 75 455 180 C465 295 310 350 175 285 C40 220 45 120 165 75Z" marker-end="url(#arrow)" />
            <g class="loop-node"><circle cx="150" cy="82" r="54"/><text x="150" y="88">Predict</text></g>
            <g class="loop-node"><circle cx="418" cy="115" r="54"/><text x="418" y="121">Observe</text></g>
            <g class="loop-node"><circle cx="397" cy="272" r="54"/><text x="397" y="278">Build</text></g>
            <g class="loop-node"><circle cx="142" cy="268" r="54"/><text x="142" y="274">Verify</text></g>
            <g class="loop-core"><circle cx="278" cy="181" r="67"/><text x="278" y="175">Explain</text><text x="278" y="198">cause &amp; effect</text></g>
          </svg>
        </div>
      </section>
      <section class="section shell" aria-labelledby="purpose-title">
        <div class="section-heading"><p class="eyebrow">Course purpose</p><h2 id="purpose-title">Knowledge that survives beyond the exercise</h2><p>Designed for experienced developers who want a precise, current refresher without assuming every language or runtime detail is still fresh.</p></div>
        <div class="feature-grid">
          ${feature("01", "See the behavior", "Start with a visual model and predict what the runtime or API will do.")}
          ${feature("02", "Change one thing", "Use a compact lab with one primary objective and observable output.")}
          ${feature("03", "Prove the result", "Build, test, review, and connect the observation back to the concept.")}
        </div>
      </section>
      <section class="section band" aria-labelledby="layers-title"><div class="shell">
        <div class="section-heading split"><div><p class="eyebrow">Dependency ordered</p><h2 id="layers-title">Nine curriculum layers</h2></div><p>Each layer introduces the vocabulary and behavior required by the next.</p></div>
        <ol class="layer-grid">${raw.layers.map(layerCard).join("")}</ol>
      </div></section>
      <section class="section shell" aria-labelledby="workflow-title">
        <div class="section-heading"><p class="eyebrow">A consistent rhythm</p><h2 id="workflow-title">Every session follows the same learning contract</h2></div>
        <ol class="workflow">
          ${["Preview the mental models", "Answer the pre-coding questions", "Learn the concept", "Complete one focused lab", "Review, test, and commit", "Explain what breaks when code is removed"].map((item,index)=>`<li><span>${String(index+1).padStart(2,"0")}</span>${escapeHtml(item)}</li>`).join("")}
        </ol>
      </section>
      <section class="section band" aria-labelledby="rules-title"><div class="shell two-column">
        <div class="section-heading"><p class="eyebrow">Course rules</p><h2 id="rules-title">Small steps. Real code. Honest validation.</h2></div>
        <ul class="check-list"><li>Concepts appear before substantial use.</li><li>Documentation names files and APIs that exist.</li><li>Temporary experiments end in a stable state.</li><li>Tests and review explain why behavior is correct.</li><li>Abstractions arrive only when their purpose is visible.</li></ul>
      </div></section>
      <section class="section shell technology" aria-labelledby="tech-title"><div><p class="eyebrow">Technology</p><h2 id="tech-title">Modern C#, .NET, xUnit, EF Core, and ASP.NET Core</h2></div><p>The static course site uses semantic HTML, accessible inline SVG, shared CSS, and small vanilla-JavaScript interactions so it remains inspectable and reliable on GitHub Pages.</p></section>
    </main>`
});

const syllabusRows = sessions.map((session) => `<tr><td><span class="session-number">${String(session.number).padStart(2,"0")}</span></td><td><strong>${escapeHtml(session.title)}</strong><small>${escapeHtml(session.curriculumLayer)}</small></td><td>${session.prerequisiteSession ? `Session ${String(session.prerequisiteSession).padStart(2,"0")}` : "None"}</td><td><span class="status planned">Planned</span></td></tr>`).join("");
const syllabus = page({ title: "Syllabus", active: "syllabus", description: "The dependency-ordered course path", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Course map</p><h1>A syllabus built in dependency order.</h1><p class="lede">Thirty-four focused sessions move from language foundations to tested application integration. Session content will be published in validated batches.</p></section><section class="shell section compact"><div class="table-wrap"><table><thead><tr><th>Session</th><th>Topic</th><th>Prerequisite</th><th>Status</th></tr></thead><tbody>${syllabusRows}</tbody></table></div></section></main>` });

const sessionCards = sessions.map((session) => `<article class="session-card"><div><span class="session-number">${String(session.number).padStart(2,"0")}</span><span class="status planned">Planned</span></div><p>${escapeHtml(session.curriculumLayer)}</p><h2>${escapeHtml(session.title)}</h2><p>Prerequisite: ${session.prerequisiteSession ? `Session ${String(session.prerequisiteSession).padStart(2,"0")}` : "None"}</p></article>`).join("");
const sessionsIndex = page({ title: "Sessions", active: "sessions", description: "All course sessions", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">34 focused lessons</p><h1>One conceptual slice at a time.</h1><p class="lede">Completed lessons will combine visual previews, prediction, explanation, a focused lab, review, and reflection.</p></section><section class="shell section compact"><div class="session-grid">${sessionCards}</div></section></main>` });

const quizzes = page({ title: "Quizzes", active: "quizzes", description: "Prediction and observation quizzes", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Predict, then explain</p><h1>Quizzes test mental models—not trivia.</h1><p class="lede">Each session begins with prerequisite and prediction questions, then ends with code-reading and cause-and-effect questions. The consistent advancement threshold is 80%.</p></section>${interactionDemo()}</main>` });
const labs = page({ title: "Labs", active: "labs", description: "Focused C# and .NET labs", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Observable experiments</p><h1>Every lab has one primary objective.</h1><p class="lede">Labs state the starting condition, exact repository paths, expected behavior, validation command, files changed, and a suggested commit.</p></section><section class="section shell"><div class="lab-contract"><h2>The lab contract</h2><ol><li>Predict the behavior before editing.</li><li>Change the smallest useful surface.</li><li>Run the documented command.</li><li>Compare the result with the expectation.</li><li>Review and commit a stable state.</li></ol></div></section></main>` });

await Promise.all([
  writeRoute("index.html", home),
  writeRoute("syllabus/index.html", syllabus),
  writeRoute("sessions/index.html", sessionsIndex),
  writeRoute("quizzes/index.html", quizzes),
  writeRoute("labs/index.html", labs),
  writeRoute("404.html", page({ title: "Page not found", active: "", description: "Page not found", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">404</p><h1>This page is not part of the course yet.</h1><a class="button primary" href="${url("")}">Return home</a></section></main>` })),
  writeFile(path.join(dist, "course-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`),
  writeFile(path.join(dist, ".nojekyll"), "")
]);

console.log(`Built ${sessions.length}-session course foundation at ${dist}`);
console.log(`Base path: ${basePath}`);

function normalizeBase(value) { return `/${value.split("/").filter(Boolean).join("/")}/`.replace("//", "/"); }
function url(relative) { return `${basePath}${relative}`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
async function writeRoute(relative, content) { const target = path.join(dist, relative); await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, content); }
function navLink(id, label, href, active) { return `<a${active === id ? ' aria-current="page"' : ""} href="${url(href)}">${label}</a>`; }
function page({ title, active, description, body }) { const documentTitle = title === raw.course.title ? title : `${title} | ${raw.course.title}`; return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#101828"><title>${escapeHtml(documentTitle)}</title><link rel="stylesheet" href="${url("assets/styles.css")}"><script defer src="${url("assets/app.js")}"></script></head><body><a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="shell nav-wrap"><a class="brand" href="${url("")}" aria-label="C#/.NET Learn with AI home"><span aria-hidden="true">C#</span><strong>Learn with AI</strong></a><button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Primary navigation">${navLink("home","Home","",active)}${navLink("syllabus","Syllabus","syllabus/",active)}${navLink("sessions","Sessions","sessions/",active)}${navLink("quizzes","Quizzes","quizzes/",active)}${navLink("labs","Labs","labs/",active)}</nav></div></header>${body}<footer><div class="shell"><div><strong>C#/.NET Learn with AI</strong><p>A Practical C# and .NET Refresher</p></div><a href="${url("syllabus/")}">View the course map</a></div></footer></body></html>`; }
function feature(number, title, copy) { return `<article class="feature"><span>${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`; }
function layerCard(layer) { return `<li><span>${String(layer.number).padStart(2,"0")}</span><div><h3>${escapeHtml(layer.title)}</h3><p>Sessions ${escapeHtml(layer.range)}</p></div></li>`; }
function interactionDemo() { return `<section class="section shell"><div class="quiz-card" data-quiz><p class="quiz-label">Interaction preview</p><h2>Which statement best describes what a useful pre-coding question should do?</h2><div class="answers"><label><input type="radio" name="demo" value="a"> Check whether syntax was memorized</label><label><input type="radio" name="demo" value="b"> Reveal a misconception by asking for a prediction</label><label><input type="radio" name="demo" value="c"> Introduce an unrelated advanced feature</label></div><button class="button primary" type="button" data-check-answer data-correct="b">Check answer</button><p class="quiz-feedback" role="status" aria-live="polite"></p></div><div class="reveal-card"><button type="button" aria-expanded="false"><span>Why prediction comes first</span><small>Reveal explanation</small></button><div hidden><p>A prediction makes the learner commit to a mental model. The observed result can then confirm or correct that model.</p></div></div></section>`; }
