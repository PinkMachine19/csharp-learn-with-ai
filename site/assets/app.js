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

document.querySelectorAll(".blur-reflection > button").forEach((button) => {
  button.addEventListener("click", () => {
    const reflection = button.closest(".blur-reflection");
    const answer = reflection?.querySelector(".blur-reflection-answer");
    const revealed = reflection?.hasAttribute("data-revealed");
    reflection?.toggleAttribute("data-revealed", !revealed);
    button.setAttribute("aria-expanded", String(!revealed));
    answer?.setAttribute("aria-hidden", String(revealed));
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

document.querySelectorAll("[data-click-highlight-instructions] .lab-instruction, [data-click-highlight-instructions] .lab-instructions > li").forEach((instruction) => {
  instruction.tabIndex = 0;
  instruction.setAttribute("role", "button");
  instruction.setAttribute("aria-pressed", "false");
  instruction.title = "Click to highlight this instruction";

  const toggleHighlight = () => {
    const highlighted = instruction.classList.toggle("instruction-highlighted");
    instruction.setAttribute("aria-pressed", String(highlighted));
    instruction.title = highlighted ? "Click to remove this highlight" : "Click to highlight this instruction";
  };

  instruction.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input, label, pre, code")) return;
    toggleHighlight();
  });
  instruction.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleHighlight();
  });
});

document.querySelectorAll("[data-step-checkboxes]").forEach((stepList, listIndex) => {
  const storageKey = `lab-step-progress:${window.location.pathname}:${listIndex}`;
  let completedSteps = [];

  try {
    completedSteps = JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    completedSteps = [];
  }

  stepList.querySelectorAll("[data-step-checkbox]").forEach((checkbox) => {
    checkbox.checked = completedSteps.includes(checkbox.dataset.stepCheckbox);
    checkbox.closest(".step")?.classList.toggle("step-completed", checkbox.checked);

    checkbox.addEventListener("change", () => {
      checkbox.closest(".step")?.classList.toggle("step-completed", checkbox.checked);
      const checked = [...stepList.querySelectorAll("[data-step-checkbox]:checked")]
        .map((item) => item.dataset.stepCheckbox);
      localStorage.setItem(storageKey, JSON.stringify(checked));
    });
  });
});

document.querySelectorAll("[data-concept-checkboxes]").forEach((conceptList, listIndex) => {
  const storageKey = `concept-paragraph-progress:${window.location.pathname}:${listIndex}`;
  const checkboxes = [...conceptList.querySelectorAll("[data-concept-checkbox]")];
  const progress = conceptList.querySelector("[data-concept-progress]");
  let completedParagraphs = [];

  try {
    completedParagraphs = JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    completedParagraphs = [];
  }

  const updateProgress = () => {
    const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
    if (progress) progress.textContent = `Reading progress: ${completed} of ${checkboxes.length}`;
  };

  checkboxes.forEach((checkbox) => {
    checkbox.checked = completedParagraphs.includes(checkbox.dataset.conceptCheckbox);
    checkbox.closest("[data-concept-paragraph]")?.classList.toggle("concept-paragraph-completed", checkbox.checked);

    checkbox.addEventListener("change", () => {
      checkbox.closest("[data-concept-paragraph]")?.classList.toggle("concept-paragraph-completed", checkbox.checked);
      const checked = checkboxes
        .filter((item) => item.checked)
        .map((item) => item.dataset.conceptCheckbox);
      localStorage.setItem(storageKey, JSON.stringify(checked));
      updateProgress();
    });
  });

  updateProgress();
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
