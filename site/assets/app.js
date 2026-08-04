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

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browsers expose the Clipboard API but block it by permission or context.
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textArea.remove();
  }

  return copied;
}

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

document.querySelectorAll(".blur-solution > button").forEach((button) => {
  button.addEventListener("click", () => {
    const solution = button.closest(".blur-solution");
    const code = solution?.querySelector("pre");
    const revealed = solution?.hasAttribute("data-revealed");
    solution?.toggleAttribute("data-revealed", !revealed);
    button.setAttribute("aria-expanded", String(!revealed));
    code?.setAttribute("aria-hidden", String(revealed));
    const hint = button.querySelector("small");
    if (hint) hint.textContent = revealed ? "Reveal blurred answer" : "Blur answer";
  });
});

document.querySelectorAll("[data-copy-instruction]").forEach((button) => {
  button.addEventListener("click", async () => {
    const instruction = button.closest(".lab-instruction")?.querySelector("p")?.textContent?.trim();
    if (!instruction) return;

    const copied = await copyTextToClipboard(instruction);
    button.textContent = copied ? "Copied!" : "Could not copy";

    window.setTimeout(() => {
      button.textContent = "Copy instructions";
    }, 1600);
  });
});

document.querySelectorAll("pre").forEach((block) => {
  const code = block.querySelector("code");
  if (!code) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code-button";
  button.textContent = "Copy";
  button.setAttribute("aria-label", "Copy code to clipboard");

  button.addEventListener("click", async () => {
    const copied = await copyTextToClipboard(code.textContent);
    if (copied) {
      button.textContent = "Copied!";
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Selected";
    }

    window.setTimeout(() => {
      button.textContent = "Copy";
    }, 1600);
  });

  block.append(button);
});
