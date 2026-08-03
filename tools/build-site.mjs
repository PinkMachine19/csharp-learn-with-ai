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

const completeCount = sessions.filter((session) => session.completionStatus === "complete").length;
const plannedCount = sessions.length - completeCount;
const statusBadge = (session) => session.completionStatus === "complete" ? `<span class="badge badge-complete">Complete</span>` : `<span class="badge badge-locked">Planned</span>`;

const syllabusRows = sessions.map((session) => `<tr><td><span class="badge badge-layer">${String(session.number).padStart(2,"0")}</span></td><td>${session.completionStatus === "complete" ? `<a href="${url(session.lessonPath.replace("index.html", ""))}"><strong>${escapeHtml(session.title)}</strong></a>` : `<strong>${escapeHtml(session.title)}</strong>`}<br><small style="color:var(--text-muted)">${escapeHtml(session.curriculumLayer)}</small></td><td>${session.prerequisiteSession !== null && session.prerequisiteSession !== undefined ? `Session ${String(session.prerequisiteSession).padStart(2,"0")}` : "None"}</td><td>${statusBadge(session)}</td></tr>`).join("");
const navGrid = `<div class="nav-grid">
  <a class="nav-card" href="${url("syllabus/")}"><div class="nav-card-title">Syllabus</div><div class="nav-card-desc">The dependency-ordered course path, one row per session.</div></a>
  <a class="nav-card" href="${url("sessions/")}"><div class="nav-card-title">Sessions</div><div class="nav-card-desc">All ${sessions.length} sessions grouped by curriculum layer.</div></a>
  <a class="nav-card" href="${url("quizzes/")}"><div class="nav-card-title">Quizzes</div><div class="nav-card-desc">Prediction and observation quizzes for every session.</div></a>
  <a class="nav-card" href="${url("labs/")}"><div class="nav-card-title">Labs</div><div class="nav-card-desc">Focused C# and .NET labs with validation commands.</div></a>
</div>`;
const layerRows = raw.layers.map((layer) => `<tr><td><span class="badge badge-layer">${layer.number}</span></td><td>${escapeHtml(layer.title)}</td><td>${escapeHtml(layer.range)}</td></tr>`).join("");
const syllabus = page({ title: "Syllabus", active: "syllabus", description: "The dependency-ordered course path", body: `<main id="main-content"><div class="container">
  <h1>${escapeHtml(raw.course.title)}</h1>
  <p class="subtitle">${escapeHtml(raw.course.subtitle)} — thirty-six focused sessions move from orientation and language foundations to tested application integration, published in validated batches.</p>
  <details class="preface" open>
    <summary><strong>Preface</strong><span class="preface-hint">Click to collapse</span></summary>
    <div class="preface-body">
      <p>Welcome.</p>
      <p>I&rsquo;m building this course primarily for myself.</p>
      <p>After spending years building production software, I&rsquo;m refreshing my C# and .NET skills while preparing for my next software engineering role. Rather than keeping scattered notes across notebooks and chat histories, I wanted a structured course that I could work through from beginning to end.</p>
      <p>If other people find it useful too, that&rsquo;s a bonus.</p>
      <hr>
      <p>This course is also an experiment in learning with AI.</p>
      <p>I use AI constantly. ChatGPT, Claude, Cursor, GitHub Copilot, and whatever comes next have become part of my everyday workflow. I don&rsquo;t see AI as a replacement for software engineers&mdash;I see it as an incredibly powerful accelerator.</p>
      <p>One way I think about AI is as an evidence engine.</p>
      <p>I&rsquo;ll describe an idea, ask a question, or make a claim, and AI searches across an enormous amount of information to build an answer. Sometimes it reinforces what I already believe. Sometimes it challenges me. Sometimes it points me toward ideas I hadn&rsquo;t considered.</p>
      <p>It&rsquo;s an amazing tool.</p>
      <p>It&rsquo;s also imperfect.</p>
      <p>AI occasionally gets facts wrong, flattens complex ideas into oversimplified explanations, or confidently presents something that simply isn&rsquo;t true. That&rsquo;s why every explanation in this course should be treated as something to understand and think about&mdash;not something to accept blindly.</p>
      <p>Engineering judgment still belongs to the human.</p>
      <hr>
      <p>One thing you&rsquo;ll notice about this repository&hellip;</p>
      <p>Much of it was created conversationally.</p>
      <p>I rarely sit down and type long sections directly into the editor.</p>
      <p>Instead, I talk through ideas, argue with AI, ask questions, challenge explanations, and gradually shape the lesson. Once I&rsquo;m happy with the direction, I have the AI help organize it into the course structure, and then I come back later to review, refine, and improve it.</p>
      <p>If you notice rough edges, incomplete explanations, or areas that later improve&mdash;that&rsquo;s expected.</p>
      <p>This repository is intentionally a living document.</p>
      <p>You&rsquo;re seeing it evolve, not pretending it was perfect from day one.</p>
      <hr>
      <p>You might wonder:</p>
      <p>&ldquo;If AI can generate code, why spend time learning any of this?&rdquo;</p>
      <p>Because writing code is only one small part of software engineering.</p>
      <p>Professional software has to be understood.<br>Maintained.<br>Debugged.<br>Extended.<br>Tested.<br>Reviewed.<br>Deployed.<br>Supported.</p>
      <p>Sometimes years after the original developers have moved on.</p>
      <p>AI can help you generate code.</p>
      <p>It cannot replace understanding why that code exists or how an entire system fits together.</p>
      <p>That&rsquo;s what this course is about.</p>
      <p>Learning the fundamentals that make AI useful instead of becoming dependent on it.</p>
      <hr>
      <p>Every session ends with a lab.</p>
      <p>Sometimes you&rsquo;ll write code.<br>Sometimes you&rsquo;ll debug.<br>Sometimes you&rsquo;ll design.<br>Sometimes you&rsquo;ll document.<br>Sometimes you&rsquo;ll simply slow down long enough to organize your own thinking.</p>
      <p>Programming isn&rsquo;t a spectator sport.</p>
      <p>Reading creates familiarity.</p>
      <p>Practice creates skill.</p>
      <hr>
      <p>Finally, if you find this course useful, you&rsquo;re welcome to build on it.</p>
      <p>Fork it.<br>Improve it.<br>Adapt it.<br>Translate it.<br>Use it however it helps you learn.</p>
      <p>My goal isn&rsquo;t to create the definitive C# course.</p>
      <p style="margin-bottom:0;">It&rsquo;s to create a resource I&rsquo;d be happy to use myself&mdash;and if it helps someone else become a better software engineer along the way, that&rsquo;s even better.</p>
    </div>
  </details>
  <div class="card">
    <div class="card-title">Course Overview</div>
    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px;">
      <span class="badge badge-layer">${sessions.length} sessions</span>
      <span class="badge badge-layer">${raw.layers.length} layers</span>
      <span class="badge badge-complete">Complete: ${completeCount}</span>
      <span class="badge badge-locked">Planned: ${plannedCount}</span>
    </div>
  </div>
  <h2>Documentation Sections</h2>
  ${navGrid}
  <h2>Curriculum Layers</h2>
  <div class="table-wrap"><table><thead><tr><th>Layer</th><th>Topic</th><th>Sessions</th></tr></thead><tbody>${layerRows}</tbody></table></div>
  <h2>Syllabus</h2>
  <div class="table-wrap"><table><thead><tr><th>Session</th><th>Topic</th><th>Prerequisite</th><th>Status</th></tr></thead><tbody>${syllabusRows}</tbody></table></div>
</div></main>` });

const sessionsByLayer = raw.layers.map((layer) => ({ layer, items: sessions.filter((session) => session.layerId === layer.id) }));
const sessionsIndexBody = sessionsByLayer.map(({ layer, items }) => `<div class="layer-header"><span class="badge badge-layer">${layer.number}</span><span class="layer-title">${escapeHtml(layer.title)}</span></div><p class="layer-desc">Sessions ${escapeHtml(layer.range)}</p><div class="nav-grid">${items.map((session) => session.completionStatus === "complete"
  ? `<a class="nav-card" href="${url(session.lessonPath.replace("index.html", ""))}"><div class="nav-card-title">Session ${String(session.number).padStart(2,"0")} — ${escapeHtml(session.title)}</div><div class="nav-card-desc">${statusBadge(session)}</div></a>`
  : `<div class="nav-card" style="opacity:.6"><div class="nav-card-title">Session ${String(session.number).padStart(2,"0")} — ${escapeHtml(session.title)}</div><div class="nav-card-desc">${statusBadge(session)}</div></div>`).join("")}</div>`).join("");
const sessionsIndex = page({ title: "Sessions", active: "sessions", description: "All course sessions", body: `<main id="main-content"><div class="container">
  <h1>Sessions</h1>
  <p class="subtitle">One conceptual slice at a time — each completed session combines visual previews, prediction, explanation, a focused lab, review, and reflection.</p>
  ${sessionsIndexBody}
</div></main>` });

const quizzes = page({ title: "Quizzes", active: "quizzes", description: "Prediction and observation quizzes", body: `<main id="main-content"><div class="container">
  <h1>Quizzes</h1>
  <p class="subtitle">Quizzes test mental models, not trivia. Each session begins with prerequisite and prediction questions, then ends with code-reading and cause-and-effect questions. The consistent advancement threshold is ${raw.course.advancementThreshold}%.</p>
  ${interactionDemo()}
</div></main>` });
const labs = page({ title: "Labs", active: "labs", description: "Focused C# and .NET labs", body: `<main id="main-content"><div class="container">
  <h1>Labs</h1>
  <p class="subtitle">Every lab has one primary objective. Labs state the starting condition, exact repository paths, expected behavior, validation command, files changed, and a suggested commit.</p>
  <div class="card">
    <div class="card-title">The lab contract</div>
    <ol>
      <li>Predict the behavior before editing.</li>
      <li>Change the smallest useful surface.</li>
      <li>Run the documented command.</li>
      <li>Compare the result with the expectation.</li>
      <li>Review and commit a stable state.</li>
    </ol>
  </div>
</div></main>` });

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
  writeRoute("index.html", syllabus),
  writeRoute("syllabus/index.html", syllabus),
  writeRoute("sessions/index.html", sessionsIndex),
  writeRoute("quizzes/index.html", quizzes),
  writeRoute("labs/index.html", labs),
  writeRoute("404.html", page({ title: "Page not found", active: "", description: "Page not found", body: `<main id="main-content"><div class="container"><p class="subtitle">404</p><h1>This page is not part of the course yet.</h1><p><a class="btn" href="${url("")}">Return home</a></p></div></main>` })),
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
function navLink(id, label, href, active) { return `<a${active === id ? ' class="active" aria-current="page"' : ""} href="${url(href)}">${label}</a>`; }
function page({ title, active, description, body, sessionWidgets }) { const widgetStyles = sessionWidgets ? `<link rel="stylesheet" href="${url("assets/notes-widget.css")}"><link rel="stylesheet" href="${url("assets/bookmark-widget.css")}"><link rel="stylesheet" href="${url("assets/shortcuts-widget.css")}">` : ""; const widgetScripts = sessionWidgets ? `<script defer src="${url("assets/notes-widget.js")}"></script><script defer src="${url("assets/bookmark-widget.js")}"></script><script defer src="${url("assets/shortcuts-widget.js")}"></script>` : ""; const documentTitle = title === raw.course.title ? title : `${title} | ${raw.course.title}`; return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#0d1117"><title>${escapeHtml(documentTitle)}</title><link rel="stylesheet" href="${url("assets/styles.css")}">${widgetStyles}<script defer src="${url("assets/app.js")}"></script>${widgetScripts}</head><body><a class="skip-link" href="#main-content">Skip to content</a><nav aria-label="Primary navigation"><div class="container"><a href="${url("")}" class="brand${active === "home" || active === "syllabus" ? " active" : ""}" aria-label="C#/.NET Learn with AI home">C# Learn with AI</a>${navLink("home","Home","",active)}${navLink("syllabus","Syllabus","syllabus/",active)}${navLink("sessions","Sessions","sessions/",active)}${navLink("quizzes","Quizzes","quizzes/",active)}${navLink("labs","Labs","labs/",active)}</div></nav><details class="academy-project-status" aria-label="Project status" open><summary><strong>Project Status</strong><span class="academy-project-status-hint">Click to collapse</span></summary><p>This course is part of an evolving personal engineering library. AI assisted with drafting and organization, but every lesson is intended to be reviewed, validated, and improved over time as I work through the material myself. Draft content should be treated as work in progress until marked as validated.</p></details>${body}<footer><div class="container"><div><strong>C#/.NET Learn with AI</strong><p>A Practical C# and .NET Refresher</p></div><a href="${url("syllabus/")}">View the course map</a></div></footer></body></html>`; }
function interactionDemo() { return `<div class="card quiz-card" data-quiz><p class="quiz-label">Interaction preview</p><h2>Which statement best describes what a useful pre-coding question should do?</h2><div class="answers"><label><input type="radio" name="demo" value="a"> Check whether syntax was memorized</label><label><input type="radio" name="demo" value="b"> Reveal a misconception by asking for a prediction</label><label><input type="radio" name="demo" value="c"> Introduce an unrelated advanced feature</label></div><button class="btn" type="button" data-check-answer data-correct="b">Check answer</button><p class="quiz-feedback" role="status" aria-live="polite"></p></div><div class="reveal-card"><button type="button" aria-expanded="false"><span>Why prediction comes first</span><small>Reveal explanation</small></button><div hidden><p>A prediction makes the learner commit to a mental model. The observed result can then confirm or correct that model.</p></div></div>`; }

function sessionPage(session, content) {
  const padded = String(session.number).padStart(2, "0");
  const position = sessions.indexOf(session);
  const previous = position > 0 ? sessions[position - 1] : null;
  const next = position < sessions.length - 1 ? sessions[position + 1] : null;
  const prevLink = previous && previous.completionStatus === "complete" ? `<a href="${url(previous.lessonPath.replace("index.html", ""))}">← Session ${String(previous.number).padStart(2,"0")}</a>` : `<span>No previous session</span>`;
  const nextLink = next ? (next.completionStatus === "complete" ? `<a href="${url(next.lessonPath.replace("index.html", ""))}">Session ${String(next.number).padStart(2,"0")} →</a>` : `<a href="${url("sessions/")}">Session ${String(next.number).padStart(2,"0")} (planned) →</a>`) : `<span>No next session</span>`;
  return page({ title: `Session ${padded} — ${session.title}`, active: "sessions", description: content.connection, sessionWidgets: true, body: `<main id="main-content"><div class="container">
    <div style="margin-bottom:8px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;"><span class="badge badge-layer">Layer ${layersById.get(session.layerId).number}</span><span class="badge badge-current">Session ${padded}</span><span style="color:var(--text-muted); font-size:12px;">${escapeHtml(content.category)}</span></div>
    <h1>${escapeHtml(session.title)}</h1>
    <p class="subtitle">${escapeHtml(content.connection)}</p>
    <div class="alert alert-info"><strong>Estimated time:</strong> ${escapeHtml(content.estimatedTime)}</div>
    <h2 aria-label="Lesson mental models">Mental Models</h2>
    <div class="visual-grid">${content.visuals.map(visualCard).join("")}</div>
    ${lessonSection("1. Learning Objectives", `<div class="card"><ol>${content.objectives.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ol></div>`)}
    ${lessonSection("2. Pre-Coding Quiz", renderQuiz(`${session.id}-pre`, content.preQuiz))}
    ${lessonSection("3. The Concept", content.concept.map((part)=>`<article class="concept-part"><h3>${escapeHtml(part.title)}</h3>${part.paragraphs.map((text)=>`<p>${escapeHtml(text)}</p>`).join("")}${part.list ? `<ul class="concept-list">${part.list.map((entry)=>`<li><strong>${escapeHtml(entry.term)}</strong> — ${escapeHtml(entry.text)}</li>`).join("")}</ul>` : ""}${(part.closingParagraphs || []).map((text)=>`<p>${escapeHtml(text)}</p>`).join("")}${part.code ? `<pre><code>${escapeHtml(part.code)}</code></pre>` : ""}</article>`).join(""))}
    ${lessonSection("4. Lab", `<div class="card"><p><strong>Primary objective:</strong> ${escapeHtml(content.lab.objective)}</p><p style="margin-bottom:0;"><strong>Starting condition:</strong> ${escapeHtml(content.lab.startingCondition)}</p></div>${content.lab.steps.map((step, index)=>{ const detail = typeof step === "string" ? { text: step } : step; return `<div class="step"><div class="step-num">${index+1}</div><div class="step-body"><p>${escapeHtml(detail.text)}</p>${detail.code ? `<pre><code>${escapeHtml(detail.code)}</code></pre>` : ""}</div></div>`; }).join("")}<p><strong>Validate:</strong></p><pre><code>${escapeHtml(content.lab.validation)}</code></pre><p><a class="btn secondary" href="${url(session.labPath)}">Open standalone lab</a></p>`)}
    ${lessonSection("5. Expected Files Changed", `<div class="table-wrap"><table><thead><tr><th>File</th><th>Action</th><th>Why</th></tr></thead><tbody>${content.expectedFiles.map((file)=>`<tr><td><code>${escapeHtml(file.path)}</code></td><td>${escapeHtml(file.action)}</td><td>${escapeHtml(file.why)}</td></tr>`).join("")}</tbody></table></div>`)}
    ${lessonSection("6. Commit Checkpoint", `<div class="alert alert-success"><code>${escapeHtml(content.commit)}</code></div>`)}
    ${lessonSection("7. Code Review Checklist", `<ul class="check-list">${content.review.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ul>`)}
    ${lessonSection("8. Post-Coding Quiz", renderQuiz(`${session.id}-post`, content.postQuiz))}
    ${lessonSection("9. Reflection Questions", `<ol>${content.reflections.map((item)=>`<li>${escapeHtml(item)}</li>`).join("")}</ol>`)}
    ${lessonSection("10. What Breaks If This Code Is Removed?", `<div class="alert alert-warning">${escapeHtml(content.whatBreaks)}</div>`)}
    ${lessonSection("11. What C#/.NET Concept Was Learned Today?", `<div class="card"><p style="margin-bottom:0;">${escapeHtml(content.summary)}</p></div>`)}
    <hr>
    <p style="margin-top:24px;" aria-label="Session navigation">${prevLink} &nbsp;·&nbsp; <a href="${url("syllabus/")}">Syllabus</a> &nbsp;·&nbsp; ${nextLink}</p>
  </div></main>` });
}
function labPage(session, content) { return page({title:`Lab ${String(session.number).padStart(2,"0")} — ${session.title}`,active:"labs",description:content.lab.objective,body:`<main id="main-content"><div class="container">
  <p class="subtitle">Session ${String(session.number).padStart(2,"0")} lab</p>
  <h1>${escapeHtml(content.lab.objective)}</h1>
  <p class="subtitle">Starting condition: ${escapeHtml(content.lab.startingCondition)}</p>
  ${content.lab.steps.map((step, index)=>{ const detail = typeof step === "string" ? { text: step } : step; return `<div class="step"><div class="step-num">${index+1}</div><div class="step-body"><p>${escapeHtml(detail.text)}</p>${detail.code ? `<pre><code>${escapeHtml(detail.code)}</code></pre>` : ""}</div></div>`; }).join("")}
  <h2>Expected behavior</h2>
  <p>${escapeHtml(content.lab.expectedBehavior)}</p>
  <h2>Validation</h2>
  <pre><code>${escapeHtml(content.lab.validation)}</code></pre>
  <h2>Commit</h2>
  <div class="alert alert-success"><code>${escapeHtml(content.commit)}</code></div>
  <p><a href="${url(session.lessonPath.replace("index.html", ""))}">Return to Session ${String(session.number).padStart(2,"0")}</a></p>
</div></main>`}); }
function quizPage(session, content) { return page({title:`Quiz ${String(session.number).padStart(2,"0")} — ${session.title}`,active:"quizzes",description:`Session ${session.number} quizzes`,body:`<main id="main-content"><div class="container">
  <p class="subtitle">Session ${String(session.number).padStart(2,"0")}</p>
  <h1>Prediction and observation quizzes</h1>
  <p class="subtitle">Score at least ${raw.course.advancementThreshold}% and read every explanation.</p>
  <h2>Before coding</h2>${renderQuiz(`${session.id}-quiz-pre`,content.preQuiz)}
  <h2>After coding</h2>${renderQuiz(`${session.id}-quiz-post`,content.postQuiz)}
  <p><a href="${url(session.lessonPath.replace("index.html", ""))}">Return to the lesson</a></p>
</div></main>`}); }
function lessonSection(title, body) { return `<hr class="section-divider">\n<h2>${title}</h2>${body}`; }
function renderQuiz(id, questions) { return `<div class="quiz-set" data-quiz-set data-threshold="${raw.course.advancementThreshold}">${questions.map((question,index)=>`<div class="card quiz-card" data-quiz><p class="quiz-label">Question ${index+1}</p><h3>${escapeHtml(question.prompt)}</h3><div class="answers">${question.options.map((option,optionIndex)=>`<label><input type="radio" name="${id}-${index}" value="${optionIndex}"> ${escapeHtml(option)}</label>`).join("")}</div><button class="btn" type="button" data-check-answer data-correct="${question.correct}">Check answer</button><p class="quiz-feedback" data-explanation="${escapeHtml(question.explanation)}" role="status" aria-live="polite"></p></div>`).join("")}</div>`; }
function visualCard(visual) { return `<div class="visual-card"><div class="visual-art">${diagram(visual.diagram)}</div><h3>${escapeHtml(visual.title)}</h3><button type="button" aria-expanded="false"><span>Explanation</span><small>Reveal</small></button><div hidden><p>${escapeHtml(visual.explanation)}</p></div></div>`; }
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
  flowstate:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d24t d24d"><title id="d24t">Null check narrows flow state</title><desc id="d24d">A nullable value passes through a null check and becomes known non-null on one path.</desc><circle cx="22" cy="60" r="14"/><path d="M36 60h32"/><path d="M68 30l38 30-38 30z"/><path d="M106 60h52"/><text x="84" y="64">null?</text><text x="140" y="52">not null</text><text x="140" y="74">safe use</text></svg>`,
  folders:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d25t d25d"><title id="d25t">A tracked file keeps a folder alive</title><desc id="d25d">One folder holds a README file and survives; an empty folder next to it fades out.</desc><rect x="15" y="30" width="65" height="60" rx="8"/><rect x="30" y="50" width="35" height="26" rx="3"/><text x="47" y="42">Validators</text><text x="47" y="67">README</text><rect x="100" y="30" width="65" height="60" rx="8" stroke-dasharray="4 4" opacity="0.5"/><text x="132" y="42">Empty</text><text x="132" y="65">∅</text></svg>`,
  depgraph:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d26t d26d"><title id="d26t">Dependencies point toward Domain</title><desc id="d26d">App, Infrastructure, and Web each reference Domain; Domain has no outgoing reference.</desc><defs><marker id="a26" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3z"/></marker></defs><rect x="8" y="12" width="42" height="26" rx="6"/><rect x="69" y="12" width="42" height="26" rx="6"/><rect x="130" y="12" width="42" height="26" rx="6"/><rect x="60" y="80" width="60" height="28" rx="6"/><path d="M29 38v34h61" marker-end="url(#a26)"/><path d="M90 38v34" marker-end="url(#a26)"/><path d="M151 38v34h-31" marker-end="url(#a26)"/><text x="29" y="29">App</text><text x="90" y="29">Infra</text><text x="151" y="29">Web</text><text x="90" y="98">Domain</text></svg>`,
  layers:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d27t d27d"><title id="d27t">Layered dependency direction</title><desc id="d27d">An upper layer of consumers rests on a lower, general-purpose layer; the arrow only points down.</desc><defs><marker id="a27" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3z"/></marker></defs><rect x="15" y="15" width="150" height="34" rx="6"/><rect x="15" y="75" width="150" height="34" rx="6"/><path d="M90 49v22" marker-end="url(#a27)"/><text x="90" y="36">App · Infrastructure · Web</text><text x="90" y="96">Domain</text></svg>`,
  toolbelt:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d28t d28d"><title id="d28t">Languages are tools on a belt</title><desc id="d28d">A belt holds several distinct tool shapes, each labeled with a different language; none of them is the belt itself.</desc><rect x="15" y="18" width="150" height="16" rx="8"/><circle cx="35" cy="72" r="17"/><rect x="70" y="55" width="34" height="34" rx="4"/><circle cx="140" cy="72" r="17"/><path d="M35 34v21M87 34v21M140 34v21"/><text x="35" y="76">C#</text><text x="87" y="76">JS</text><text x="140" y="76">Py</text><text x="90" y="13">tools, not rivals</text></svg>`,
  skew:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d29t d29d"><title id="d29t">Visible content skews toward a few languages</title><desc id="d29d">A tall bar for scripting and web tutorial content stands beside a much shorter bar for enterprise content, though both represent large parts of the real industry.</desc><path d="M20 108V20M20 108h140"/><rect x="42" y="30" width="32" height="78"/><rect x="104" y="82" width="32" height="26"/><text x="58" y="24">tutorials</text><text x="120" y="76">enterprise</text></svg>`,
  ecosystem:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d30t d30d"><title id="d30t">A system is an ecosystem, not one language</title><desc id="d30d">A central system node connects to five separate technology nodes arranged around it, each a different language or tool collaborating on the same system.</desc><circle cx="90" cy="62" r="19"/><circle cx="90" cy="15" r="12"/><circle cx="32" cy="42" r="12"/><circle cx="32" cy="88" r="12"/><circle cx="148" cy="42" r="12"/><circle cx="148" cy="88" r="12"/><path d="M90 43v-16M75 51l-31-8M75 73l-31 8M105 51l31-8M105 73l31 8"/><text x="90" y="66">system</text><text x="90" y="19">C#</text><text x="32" y="46">JS</text><text x="32" y="92">SQL</text><text x="148" y="46">Py</text><text x="148" y="92">CI</text></svg>`,
  stack:`<svg viewBox="0 0 180 120" role="img" aria-labelledby="d31t d31d"><title id="d31t">A layered polyglot architecture</title><desc id="d31d">Browser, TypeScript frontend, C# API, SQL Server, and Python and CI/CD tooling are stacked as five collaborating layers connected by arrows.</desc><defs><marker id="a31" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0L0 6L8 3z"/></marker></defs><rect x="15" y="2" width="150" height="18" rx="3"/><rect x="15" y="26" width="150" height="18" rx="3"/><rect x="15" y="50" width="150" height="18" rx="3"/><rect x="15" y="74" width="150" height="18" rx="3"/><rect x="15" y="98" width="150" height="18" rx="3"/><path d="M90 20v6M90 44v6M90 68v6M90 92v6" marker-end="url(#a31)"/><text x="90" y="15">Browser</text><text x="90" y="39">TS/JS UI</text><text x="90" y="63">C# API</text><text x="90" y="87">SQL Server</text><text x="90" y="111">Python · CI/CD</text></svg>`
}; return diagrams[kind] || diagrams.feedback; }
