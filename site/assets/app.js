function persistDetailsOpenState(element, storageKey) {
  if (!element) return;
  const stored = localStorage.getItem(storageKey);
  if (stored !== null) element.open = stored === "true";
  element.addEventListener("toggle", () => {
    localStorage.setItem(storageKey, String(element.open));
  });
}

persistDetailsOpenState(document.querySelector(".academy-project-status"), "academy-project-status-open");
persistDetailsOpenState(document.querySelector(".preface"), "academy-preface-open");

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#site-nav");

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navigation?.toggleAttribute("data-open", !expanded);
});

document.querySelectorAll(".reveal-card > button, .visual-card > button").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
    const hint = button.querySelector("small");
    if (hint) hint.textContent = expanded ? "Reveal explanation" : "Hide explanation";
  });
});

document.querySelectorAll("[data-check-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const quiz = button.closest("[data-quiz]");
    const chosen = quiz?.querySelector("input:checked");
    const feedback = quiz?.querySelector(".quiz-feedback");
    if (!feedback) return;
    if (!chosen) {
      feedback.textContent = "Choose an answer before checking.";
      feedback.dataset.state = "notice";
      return;
    }
    const correct = chosen.value === button.dataset.correct;
    const explanation = feedback.dataset.explanation;
    feedback.textContent = explanation
      ? `${correct ? "Correct." : "Not quite."} ${explanation}`
      : correct
        ? "Correct. Prediction exposes the learner's current mental model."
        : "Not quite. A strong question asks for a prediction that can be compared with observed behavior.";
    feedback.dataset.state = correct ? "correct" : "incorrect";
  });
});
