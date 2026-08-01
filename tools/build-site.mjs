import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
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
const contentDirectory = path.join(site, "data", "sessions");
const contentFiles = await readdir(contentDirectory).catch(() => []);
const sessionContent = new Map(await Promise.all(contentFiles.filter((name) => name.endsWith(".json")).map(async (name) => {
  const content = JSON.parse(await readFile(path.join(contentDirectory, name), "utf8"));
  return [content.number, content];
})));
const sessions = raw.sessions.map(([number, slug, title, layerId, prerequisite, migrationSource]) => {
  const padded = String(number).padStart(2, "0");
  const content = sessionContent.get(number);
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
    filesExpectedToChange: content ? content.expectedFiles.map((file) => file.path) : [],
    validationCommand: "npm test",
    suggestedCommitMessage: content?.commit || `session-${padded}: ${title.toLowerCase()}`,
    migrationSource: `source steps ${migrationSource}`,
    completionStatus: sessionContent.has(number) ? "complete" : "planned"
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

const syllabusRows = sessions.map((session) => `<tr><td><span class="session-number">${String(session.number).padStart(2,"0")}</span></td><td>${session.completionStatus === "complete" ? `<a href="${url(session.lessonPath.replace("index.html", ""))}"><strong>${escapeHtml(session.title)}</strong></a>` : `<strong>${escapeHtml(session.title)}</strong>`}<small>${escapeHtml(session.curriculumLayer)}</small></td><td>${session.prerequisiteSession ? `Session ${String(session.prerequisiteSession).padStart(2,"0")}` : "None"}</td><td><span class="status ${session.completionStatus}">${session.completionStatus === "complete" ? "Complete" : "Planned"}</span></td></tr>`).join("");
const syllabus = page({ title: "Syllabus", active: "syllabus", description: "The dependency-ordered course path", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Course map</p><h1>A syllabus built in dependency order.</h1><p class="lede">Thirty-four focused sessions move from language foundations to tested application integration. Session content will be published in validated batches.</p></section><section class="shell section compact"><div class="table-wrap"><table><thead><tr><th>Session</th><th>Topic</th><th>Prerequisite</th><th>Status</th></tr></thead><tbody>${syllabusRows}</tbody></table></div></section></main>` });

const sessionCards = sessions.map((session) => `<article class="session-card"><div><span class="session-number">${String(session.number).padStart(2,"0")}</span><span class="status ${session.completionStatus}">${session.completionStatus === "complete" ? "Complete" : "Planned"}</span></div><p>${escapeHtml(session.curriculumLayer)}</p><h2>${session.completionStatus === "complete" ? `<a href="${url(session.lessonPath.replace("index.html", ""))}">${escapeHtml(session.title)}</a>` : escapeHtml(session.title)}</h2><p>Prerequisite: ${session.prerequisiteSession ? `Session ${String(session.prerequisiteSession).padStart(2,"0")}` : "None"}</p></article>`).join("");
const sessionsIndex = page({ title: "Sessions", active: "sessions", description: "All course sessions", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">34 focused lessons</p><h1>One conceptual slice at a time.</h1><p class="lede">Completed lessons will combine visual previews, prediction, explanation, a focused lab, review, and reflection.</p></section><section class="shell section compact"><div class="session-grid">${sessionCards}</div></section></main>` });

const quizzes = page({ title: "Quizzes", active: "quizzes", description: "Prediction and observation quizzes", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Predict, then explain</p><h1>Quizzes test mental models—not trivia.</h1><p class="lede">Each session begins with prerequisite and prediction questions, then ends with code-reading and cause-and-effect questions. The consistent advancement threshold is 80%.</p></section>${interactionDemo()}</main>` });
const labs = page({ title: "Labs", active: "labs", description: "Focused C# and .NET labs", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Observable experiments</p><h1>Every lab has one primary objective.</h1><p class="lede">Labs state the starting condition, exact repository paths, expected behavior, validation command, files changed, and a suggested commit.</p></section><section class="section shell"><div class="lab-contract"><h2>The lab contract</h2><ol><li>Predict the behavior before editing.</li><li>Change the smallest useful surface.</li><li>Run the documented command.</li><li>Compare the result with the expectation.</li><li>Review and commit a stable state.</li></ol></div></section></main>` });

const sessionRoutes = [];
for (const [number, content] of sessionContent) {
  const session = sessions.find((item) => item.number === number);
  sessionRoutes.push(
    writeRoute(session.lessonPath, sessionPage(session, content)),
    writeRoute(session.labPath, labPage(session, content)),
    writeRoute(session.quizPath, quizPage(session, content))
  );
}

await Promise.all([
  writeRoute("index.html", home),
  writeRoute("syllabus/index.html", syllabus),
  writeRoute("sessions/index.html", sessionsIndex),
  writeRoute("quizzes/index.html", quizzes),
  writeRoute("labs/index.html", labs),
  writeRoute("404.html", page({ title: "Page not found", active: "", description: "Page not found", body: `<main id="main-content"><section class="page-intro shell"><p class="eyebrow">404</p><h1>This page is not part of the course yet.</h1><a class="button primary" href="${url("")}">Return home</a></section></main>` })),
  writeFile(path.join(dist, "course-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`),
  writeFile(path.join(dist, ".nojekyll"), ""),
  ...sessionRoutes
]);

console.log(`Built ${sessions.length}-session course foundation at ${dist}`);
console.log(`Base path: ${basePath}`);

function normalizeBase(value) { return `/${value.split("/").filter(Boolean).join("/")}/`.replace("//", "/"); }
function url(relative) { return `${basePath}${relative}`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
async function writeRoute(relative, content) { const target = path.join(dist, relative); await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, content); }
function navLink(id, label, href, active) { return `<a${active === id ? ' aria-current="page"' : ""} href="${url(href)}">${label}</a>`; }
function page({ title, active, description, body }) { const documentTitle = title === raw.course.title ? title : `${title} | ${raw.course.title}`; return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#0d1117"><title>${escapeHtml(documentTitle)}</title><link rel="stylesheet" href="${url("assets/styles.css")}"><script defer src="${url("assets/app.js")}"></script></head><body><a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="shell nav-wrap"><a class="brand" href="${url("")}" aria-label="C#/.NET Learn with AI home"><span aria-hidden="true">C#</span><strong>Learn with AI</strong></a><button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Primary navigation">${navLink("home","Home","",active)}${navLink("syllabus","Syllabus","syllabus/",active)}${navLink("sessions","Sessions","sessions/",active)}${navLink("quizzes","Quizzes","quizzes/",active)}${navLink("labs","Labs","labs/",active)}</nav></div></header>${body}<footer><div class="shell"><div><strong>C#/.NET Learn with AI</strong><p>A Practical C# and .NET Refresher</p></div><a href="${url("syllabus/")}">View the course map</a></div></footer><aside class="academy-project-status" aria-label="Project status" style="max-width:920px;margin:40px auto 24px;padding:16px 24px;border:1px solid #30363d;border-left:4px solid #ff5ca8;border-radius:6px;background:#161b22;color:#8b949e;font:13px/1.6 -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif"><strong style="color:#ff5ca8">Project Status:</strong> This course is part of an evolving personal engineering library. AI assisted with drafting and organization, but every lesson is intended to be reviewed, validated, and improved over time as I work through the material myself. Draft content should be treated as work in progress until marked as validated.</aside></body></html>`; }
function feature(number, title, copy) { return `<article class="feature"><span>${number}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`; }
function layerCard(layer) { return `<li><span>${String(layer.number).padStart(2,"0")}</span><div><h3>${escapeHtml(layer.title)}</h3><p>Sessions ${escapeHtml(layer.range)}</p></div></li>`; }
function interactionDemo() { return `<section class="section shell"><div class="quiz-card" data-quiz><p class="quiz-label">Interaction preview</p><h2>Which statement best describes what a useful pre-coding question should do?</h2><div class="answers"><label><input type="radio" name="demo" value="a"> Check whether syntax was memorized</label><label><input type="radio" name="demo" value="b"> Reveal a misconception by asking for a prediction</label><label><input type="radio" name="demo" value="c"> Introduce an unrelated advanced feature</label></div><button class="button primary" type="button" data-check-answer data-correct="b">Check answer</button><p class="quiz-feedback" role="status" aria-live="polite"></p></div><div class="reveal-card"><button type="button" aria-expanded="false"><span>Why prediction comes first</span><small>Reveal explanation</small></button><div hidden><p>A prediction makes the learner commit to a mental model. The observed result can then confirm or correct that model.</p></div></div></section>`; }

function sessionPage(session, content) {
  const padded = String(session.number).padStart(2, "0");
  const previous = session.number > 1 ? sessions[session.number - 2] : null;
  const next = session.number < sessions.length ? sessions[session.number] : null;
  return page({ title: `Session ${padded} — ${session.title}`, active: "sessions", description: content.connection, body: `<main id="main-content" class="lesson">
    <header class="lesson-header shell"><p class="eyebrow">Layer ${layersById.get(session.layerId).number} · Session ${padded} · ${escapeHtml(content.category)}</p><h1>${escapeHtml(session.title)}</h1><p class="lede">${escapeHtml(content.connection)}</p><p class="lesson-time">Estimated time: ${escapeHtml(content.estimatedTime)}</p></header>
    <section class="visual-deck shell" aria-label="Lesson mental models">${content.visuals.map(visualCard).join("")}</section>
    <div class="lesson-body shell">
      ${lessonSection("1. Learning Objectives", `<ul>${content.objectives.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
      ${lessonSection("2. Pre-Coding Quiz", renderQuiz(`${session.id}-pre`, content.preQuiz))}
      ${lessonSection("3. The Concept", content.concept.map((part)=>`<article class="concept-part"><h3>${escapeHtml(part.title)}</h3>${part.paragraphs.map((text)=>`<p>${escapeHtml(text)}</p>`).join("")}${part.code ? `<pre><code>${escapeHtml(part.code)}</code></pre>` : ""}</article>`).join(""))}
      ${lessonSection("4. Lab", `<p><strong>Primary objective:</strong> ${escapeHtml(content.lab.objective)}</p><p><strong>Starting condition:</strong> ${escapeHtml(content.lab.startingCondition)}</p><ol>${content.lab.steps.map((step)=>`<li>${escapeHtml(step)}</li>`).join("")}</ol><p><strong>Validate:</strong> <code>${escapeHtml(content.lab.validation)}</code></p><p><a class="button secondary" href="${url(session.labPath)}">Open standalone lab</a></p>`)}
      ${lessonSection("5. Expected Files Changed", `<div class="table-wrap"><table><thead><tr><th>File</th><th>Action</th><th>Why</th></tr></thead><tbody>${content.expectedFiles.map((file)=>`<tr><td><code>${escapeHtml(file.path)}</code></td><td>${escapeHtml(file.action)}</td><td>${escapeHtml(file.why)}</td></tr>`).join("")}</tbody></table></div>`)}
      ${lessonSection("6. Commit Checkpoint", `<div class="checkpoint"><code>${escapeHtml(content.commit)}</code></div>`)}
      ${lessonSection("7. Code Review Checklist", `<ul class="check-list">${content.review.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
      ${lessonSection("8. Post-Coding Quiz", renderQuiz(`${session.id}-post`, content.postQuiz))}
      ${lessonSection("9. Reflection Questions", `<ol>${content.reflections.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ol>`)}
      ${lessonSection("10. What Breaks If This Code Is Removed?", `<p>${escapeHtml(content.whatBreaks)}</p>`)}
      ${lessonSection("11. What C#/.NET Concept Was Learned Today?", `<div class="concept-summary"><p>${escapeHtml(content.summary)}</p></div>`)}
    </div>
    <nav class="lesson-nav shell" aria-label="Session navigation">${previous && previous.completionStatus === "complete" ? `<a href="${url(previous.lessonPath.replace("index.html", ""))}">← Session ${String(previous.number).padStart(2,"0")}</a>` : `<span aria-label="No previous session"></span>`}<a href="${url("syllabus/")}">Syllabus</a>${next ? next.completionStatus === "complete" ? `<a href="${url(next.lessonPath.replace("index.html", ""))}">Session ${String(next.number).padStart(2,"0")} →</a>` : `<a href="${url("sessions/")}">Session ${String(next.number).padStart(2,"0")} (planned) →</a>` : `<span aria-label="No next session"></span>`}</nav>
  </main>` });
}
function labPage(session, content) { return page({title:`Lab ${String(session.number).padStart(2,"0")} — ${session.title}`,active:"labs",description:content.lab.objective,body:`<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Session ${String(session.number).padStart(2,"0")} lab</p><h1>${escapeHtml(content.lab.objective)}</h1><p class="lede">Starting condition: ${escapeHtml(content.lab.startingCondition)}</p></section><section class="section compact shell"><div class="lab-contract"><ol>${content.lab.steps.map((step)=>`<li>${escapeHtml(step)}</li>`).join("")}</ol><h2>Expected behavior</h2><p>${escapeHtml(content.lab.expectedBehavior)}</p><h2>Validation</h2><pre><code>${escapeHtml(content.lab.validation)}</code></pre><h2>Commit</h2><code>${escapeHtml(content.commit)}</code><p><a href="${url(session.lessonPath.replace("index.html", ""))}">Return to Session ${String(session.number).padStart(2,"0")}</a></p></div></section></main>`}); }
function quizPage(session, content) { return page({title:`Quiz ${String(session.number).padStart(2,"0")} — ${session.title}`,active:"quizzes",description:`Session ${session.number} quizzes`,body:`<main id="main-content"><section class="page-intro shell"><p class="eyebrow">Session ${String(session.number).padStart(2,"0")}</p><h1>Prediction and observation quizzes</h1><p class="lede">Score at least ${raw.course.advancementThreshold}% and read every explanation.</p></section><section class="section compact shell"><h2>Before coding</h2>${renderQuiz(`${session.id}-quiz-pre`,content.preQuiz)}<h2>After coding</h2>${renderQuiz(`${session.id}-quiz-post`,content.postQuiz)}<p><a href="${url(session.lessonPath.replace("index.html", ""))}">Return to the lesson</a></p></section></main>`}); }
function lessonSection(title, body) { return `<section class="lesson-section"><h2>${title}</h2>${body}</section>`; }
function renderQuiz(id, questions) { return `<div class="quiz-set" data-quiz-set data-threshold="${raw.course.advancementThreshold}">${questions.map((question,index)=>`<div class="quiz-card" data-quiz><p class="quiz-label">Question ${index+1}</p><h3>${escapeHtml(question.prompt)}</h3><div class="answers">${question.options.map((option,optionIndex)=>`<label><input type="radio" name="${id}-${index}" value="${optionIndex}"> ${escapeHtml(option)}</label>`).join("")}</div><button class="button primary" type="button" data-check-answer data-correct="${question.correct}">Check answer</button><p class="quiz-feedback" data-explanation="${escapeHtml(question.explanation)}" role="status" aria-live="polite"></p></div>`).join("")}</div>`; }
function visualCard(visual) { return `<article class="visual-card"><div class="visual-art">${diagram(visual.diagram)}</div><h2>${escapeHtml(visual.title)}</h2><button type="button" aria-expanded="false"><span>Explanation</span><small>Reveal</small></button><div hidden><p>${escapeHtml(visual.explanation)}</p></div></article>`; }
function diagram(kind) { const diagrams = {
  solution:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d1t d1d"><title id="d1t">Solution contains projects</title><desc id="d1d">A solution box contains app, domain, and tests project boxes.</desc><rect x="8" y="8" width="164" height="104" rx="12"/><rect x="22" y="37" width="40" height="50"/><rect x="70" y="37" width="40" height="50"/><rect x="118" y="37" width="40" height="50"/><text x="90" y="27">solution</text><text x="42" y="66">app</text><text x="90" y="66">core</text><text x="138" y="66">tests</text></svg>`,
  pipeline:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d2t d2d"><title id="d2t">Build pipeline</title><desc id="d2d">Source flows through compiler to application output.</desc><defs><marker id="a2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3z"/></marker></defs><rect x="6" y="42" width="45" height="35" rx="6"/><rect x="68" y="42" width="45" height="35" rx="6"/><rect x="130" y="42" width="45" height="35" rx="6"/><path d="M52 60h15M114 60h15" marker-end="url(#a2)"/><text x="28" y="64">code</text><text x="90" y="64">build</text><text x="152" y="64">app</text></svg>`,
  feedback:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d3t d3d"><title id="d3t">Feedback loop</title><desc id="d3d">Edit, build, observe, and adjust form a loop.</desc><circle cx="90" cy="60" r="45"/><path d="M90 15a45 45 0 0 1 43 31"/><text x="90" y="55">edit → build</text><text x="90" y="75">↑ adjust ← see</text></svg>`,
  tests:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d4t d4d"><title id="d4t">Tests compare behavior</title><desc id="d4d">An input passes through code and is compared with an expected result.</desc><circle cx="25" cy="60" r="16"/><rect x="62" y="38" width="56" height="44" rx="8"/><path d="M42 60h19M119 60h18"/><circle cx="154" cy="60" r="18"/><path d="M146 60l6 6 11-13"/><text x="90" y="65">code</text></svg>`,
  variable:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d5t d5d"><title id="d5t">Named value</title><desc id="d5d">A variable label points to a stored numeric value.</desc><rect x="30" y="35" width="120" height="52" rx="10"/><text x="62" y="65">hours</text><path d="M91 42v38"/><text x="120" y="65">8.0</text></svg>`,
  expression:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d6t d6d"><title id="d6t">Expression produces value</title><desc id="d6d">Two numeric values and an operator flow to a result.</desc><circle cx="28" cy="45" r="17"/><circle cx="28" cy="83" r="17"/><path d="M45 45l45 18M45 83l45-18"/><rect x="90" y="43" width="36" height="40" rx="8"/><path d="M127 63h24"/><text x="28" y="50">8</text><text x="28" y="88">.5</text><text x="108" y="68">−</text><text x="160" y="68">7.5</text></svg>`,
  type:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d7t d7d"><title id="d7t">Type boundary</title><desc id="d7d">A decimal-shaped token fits a decimal boundary while text does not.</desc><path d="M70 25h80v70H70z"/><circle cx="38" cy="45" r="18"/><rect x="20" y="73" width="36" height="20"/><path d="M56 45h13"/><text x="38" y="50">8m</text><text x="38" y="88">text</text><text x="110" y="64">decimal</text></svg>`,
  decimal:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d8t d8d"><title id="d8t">Decimal precision</title><desc id="d8d">A decimal scale balances tenths exactly.</desc><path d="M90 27v58M48 48h84M55 48l-18 36h36zM125 48l-18 36h36z"/><text x="55" y="104">0.1m</text><text x="125" y="104">exact</text></svg>`,
  branch:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d9t d9d"><title id="d9t">Conditional branch</title><desc id="d9d">A condition splits execution into true and false paths that rejoin.</desc><path d="M90 8l40 30-40 30-40-30zM50 38H20v55h55M130 38h30v55h-55M75 93h30"/><text x="90" y="43">open?</text><text x="25" y="31">yes</text><text x="142" y="31">no</text></svg>`,
  comparison:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d10t d10d"><title id="d10t">Comparison produces Boolean</title><desc id="d10d">Two values enter a comparison and true comes out.</desc><circle cx="25" cy="42" r="15"/><circle cx="25" cy="82" r="15"/><path d="M40 42l37 18M40 82l37-18"/><rect x="77" y="42" width="38" height="38" rx="6"/><path d="M116 61h30"/><text x="96" y="66">&gt;</text><text x="159" y="66">true</text></svg>`,
  switch:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d11t d11d"><title id="d11t">Pattern decision</title><desc id="d11d">One input flows to three labeled pattern outcomes.</desc><circle cx="35" cy="60" r="22"/><path d="M57 60h30M87 60l35-35M87 60h35M87 60l35 35"/><text x="35" y="65">state</text><text x="145" y="28">open</text><text x="145" y="64">done</text><text x="145" y="100">other</text></svg>`,
  path:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d12t d12d"><title id="d12t">One execution path</title><desc id="d12d">A highlighted route moves through a decision to one output while another route remains inactive.</desc><path d="M15 60h50l25-30 25 30h50"/><path class="active" d="M15 60h50l25-30 25 30"/><circle cx="15" cy="60" r="8"/><circle cx="165" cy="60" r="8"/><text x="90" y="20">chosen path</text></svg>`,
  call:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d13t d13d"><title id="d13t">Method call transfers control</title><desc id="d13d">Arguments flow into a named method and a result flows back.</desc><rect x="58" y="30" width="70" height="55" rx="8"/><path d="M8 48h48M128 68h44"/><text x="92" y="62">method</text><text x="28" y="42">args</text><text x="150" y="62">result</text></svg>`,
  frame:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d14t d14d"><title id="d14t">Local scope frame</title><desc id="d14d">A method boundary contains parameters and local variables.</desc><rect x="28" y="15" width="124" height="90" rx="10"/><rect x="42" y="38" width="42" height="40"/><rect x="96" y="38" width="42" height="40"/><text x="90" y="29">scope</text><text x="63" y="61">param</text><text x="117" y="61">local</text></svg>`,
  return:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d15t d15d"><title id="d15t">Return value crosses boundary</title><desc id="d15d">A calculation inside a method produces one value for the caller.</desc><rect x="18" y="28" width="90" height="64" rx="9"/><path d="M108 60h52"/><circle cx="160" cy="60" r="13"/><text x="63" y="64">calculate</text><text x="160" y="64">v</text></svg>`,
  signature:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d16t d16d"><title id="d16t">Method signature contract</title><desc id="d16d">Return type, name, and parameters form a callable contract.</desc><rect x="12" y="35" width="156" height="52" rx="8"/><path d="M57 35v52M105 35v52"/><text x="34" y="63">return</text><text x="81" y="63">name</text><text x="137" y="63">params</text></svg>`,
  blueprint:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d17t d17d"><title id="d17t">Class defines object shape</title><desc id="d17d">One class blueprint points to two separate object instances.</desc><rect x="12" y="27" width="58" height="66"/><circle cx="125" cy="38" r="24"/><circle cx="125" cy="88" r="24"/><path d="M70 48h30M70 72h30"/><text x="41" y="62">class</text><text x="125" y="42">A</text><text x="125" y="92">B</text></svg>`,
  constructor:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d18t d18d"><title id="d18t">Constructor establishes state</title><desc id="d18d">Input values pass through a constructor into initialized properties.</desc><circle cx="24" cy="42" r="13"/><circle cx="24" cy="80" r="13"/><path d="M38 42l35 18M38 80l35-18"/><rect x="73" y="35" width="52" height="50"/><path d="M125 60h32"/><text x="99" y="64">new</text><text x="165" y="64">obj</text></svg>`,
  property:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d19t d19d"><title id="d19t">Property exposes state</title><desc id="d19d">An object boundary exposes named properties while keeping its interior controlled.</desc><rect x="35" y="15" width="110" height="90" rx="12"/><rect x="52" y="38" width="76" height="18"/><rect x="52" y="66" width="76" height="18"/><text x="90" y="51">Id</text><text x="90" y="79">Name</text></svg>`,
  instances:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d20t d20d"><title id="d20t">Instances hold independent values</title><desc id="d20d">Two objects from one class contain different identity and name values.</desc><rect x="10" y="25" width="72" height="70" rx="9"/><rect x="98" y="25" width="72" height="70" rx="9"/><text x="46" y="51">001</text><text x="46" y="76">Avery</text><text x="134" y="51">002</text><text x="134" y="76">Morgan</text></svg>`,
  nullable:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d21t d21d"><title id="d21t">Nullable state has two cases</title><desc id="d21d">A nullable property can hold a value or an explicit no-value state.</desc><path d="M90 12v25M90 37L45 70M90 37l45 33"/><circle cx="45" cy="85" r="23"/><circle cx="135" cy="85" r="23"/><text x="45" y="89">value</text><text x="135" y="89">null</text></svg>`,
  invariant:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d22t d22d"><title id="d22t">Invariant guards object state</title><desc id="d22d">Input passes a guard before entering the valid object boundary.</desc><circle cx="22" cy="60" r="13"/><path d="M36 60h30"/><path d="M66 32l38 28-38 28z"/><path d="M104 60h28"/><rect x="132" y="35" width="40" height="50"/><text x="82" y="64">valid?</text><text x="152" y="64">object</text></svg>`,
  initializer:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d23t d23d"><title id="d23t">Object initializer sets optional state</title><desc id="d23d">Required constructor state is followed by optional named initialization.</desc><rect x="12" y="38" width="55" height="44"/><path d="M67 60h30"/><rect x="97" y="22" width="72" height="76"/><text x="39" y="64">new</text><text x="133" y="51">Id ✓</text><text x="133" y="75">Team ?</text></svg>`,
  flowstate:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d24t d24d"><title id="d24t">Null check narrows flow state</title><desc id="d24d">A nullable value passes through a null check and becomes known non-null on one path.</desc><circle cx="22" cy="60" r="14"/><path d="M36 60h32"/><path d="M68 30l38 30-38 30z"/><path d="M106 60h52"/><text x="84" y="64">null?</text><text x="140" y="52">not null</text><text x="140" y="74">safe use</text></svg>`
}; return diagrams[kind] || diagrams.feedback; }
