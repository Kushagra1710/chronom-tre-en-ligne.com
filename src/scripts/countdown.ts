import {
  Countdown,
  parseTimerSnapshot,
  routine,
  type Phase,
} from "../lib/countdown";
import { parts, formatTime } from "../lib/stopwatch";
import {
  HISTORY_KEY,
  ROUTINES_KEY,
  addRoutine,
  addSession,
  parseHistory,
  parseRoutines,
  type RoutineMode,
} from "../lib/routines";
const el = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const mode =
  document.querySelector<HTMLElement>("[data-timer-mode]")!.dataset.timerMode!;
const key = `rs-timer-${mode}-v1`;
const form = el<HTMLFormElement>("timer-form");
const fields = el<HTMLFieldSetElement>("timer-fields");
const title = document.title;
const sound = el<HTMLInputElement>("timer-sound");
let pending: ReturnType<typeof parseTimerSnapshot> = null;
let audio: AudioContext | null = null;
let touched = false;
let discardPending = false;
let completedRecorded = false;
const resetDialog = el<HTMLDialogElement>("timer-reset-dialog");
const card = el("countdown-card");
const input = (id: string) => el<HTMLInputElement>(id);
const value = (id: string) => input(id).valueAsNumber;
const message = (text: string) => {
  el("timer-message").textContent = text;
};
const error = (text = "") => {
  el("timer-error").hidden = !text;
  el("timer-error").textContent = text;
};
try {
  const raw = localStorage.getItem(key);
  pending = parseTimerSnapshot(raw);
  if (pending) {
    const saved = JSON.parse(raw!);
    if (typeof saved.sound === "boolean") sound.checked = saved.sound;
    if (saved.inputs && typeof saved.inputs === "object")
      form
        .querySelectorAll<HTMLInputElement>("input[type=number]")
        .forEach((node) => {
          const next = saved.inputs[node.id];
          if (
            Number.isInteger(next) &&
            next >= Number(node.min) &&
            next <= Number(node.max)
          )
            node.value = String(next);
        });
  }
} catch {
  el("timer-storage-note").textContent = "Storage unavailable";
}
function inputValues() {
  return Object.fromEntries(
    Array.from(form.querySelectorAll<HTMLInputElement>("input[type=number]")).map(
      (node) => [node.id, node.valueAsNumber],
    ),
  );
}
try {
  const routineId = new URLSearchParams(location.search).get("routine");
  const savedRoutine = parseRoutines(localStorage.getItem(ROUTINES_KEY)).find(
    (item) => item.id === routineId && item.mode === mode,
  );
  if (savedRoutine) {
    Object.entries(savedRoutine.inputs).forEach(([id, next]) => {
      const node = document.getElementById(id) as HTMLInputElement | null;
      if (node && Number.isInteger(next) && next >= Number(node.min) && next <= Number(node.max)) node.value = String(next);
    });
    // Choosing a named routine is an intentional fresh start, not a recovery.
    pending = null;
    el("timer-storage-note").textContent = `Routine: ${savedRoutine.name}`;
  }
} catch {}
function phases(): Phase[] | null {
  if (!form.reportValidity()) return null;
  if (mode === "countdown") {
    const duration =
      (value("duration-hours") * 3600 +
        value("duration-minutes") * 60 +
        value("duration-seconds")) *
      1000;
    if (!duration) {
      error("Set a duration of at least 1 second.");
      input("duration-seconds").focus();
      return null;
    }
    return [{ label: "Countdown", duration, round: 1 }];
  }
  return mode === "pomodoro"
    ? routine(
        value("focus-minutes") * 60000,
        value("break-minutes") * 60000,
        value("timer-rounds"),
        value("long-minutes") * 60000,
        true,
      )
    : routine(
        value("work-seconds") * 1000,
        value("rest-seconds") * 1000,
        value("timer-rounds"),
      );
}
let timer = new Countdown(
  phases() || [{ label: "Countdown", duration: 300000, round: 1 }],
);
function save() {
  if (pending) return;
  const inputs = inputValues();
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ ...timer.snapshot(), inputs, sound: sound.checked }),
    );
    el("timer-storage-note").textContent = "Saved on this device";
  } catch {
    el("timer-storage-note").textContent = "Storage unavailable";
  }
}
function updatePreview() {
  const list = document.getElementById("routine-preview");
  if (!list) return;
  list.replaceChildren();
  // Only show a short, readable preview even when a routine has 100 rounds.
  for (let i = 0; i < Math.min(6, timer.phases.length); i++) {
    const phase = timer.phases[i];
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${phase.round}. ${phase.label}`;
    const duration = document.createElement("strong");
    duration.textContent = formatTime(phase.duration).split(".")[0];
    item.append(label, duration);
    list.append(item);
  }
  if (timer.phases.length > 6) {
    const item = document.createElement("li");
    item.textContent = `+ ${timer.phases.length - 6} more phases`;
    list.append(item);
  }
  el("routine-total").textContent =
    `${formatTime(timer.total).split(".")[0]} total`;
}
function render() {
  const time = parts(Math.ceil(timer.remaining / 1000) * 1000);
  el("countdown-hours").textContent = time.hours;
  el("countdown-minutes").textContent = time.minutes;
  el("countdown-seconds").textContent = time.seconds;
  el("phase-label").textContent = timer.finished
    ? "A moment well spent."
    : mode === "countdown"
      ? "Your countdown"
      : timer.phase.label;
  el("countdown-state").textContent = pending
    ? "Your saved session is ready"
    : timer.finished
      ? "Session complete"
      : timer.running
        ? "A moment in motion"
        : touched
          ? "Paused. Take your time."
          : "Ready when you are";
  el("countdown-toggle-label").textContent = timer.finished
    ? "Start again"
    : timer.running
      ? "Pause"
      : touched
        ? "Resume"
        : "Start";
  el<HTMLButtonElement>("countdown-toggle").disabled = !!pending;
  el<HTMLButtonElement>("countdown-reset").disabled = !touched && !pending;
  el("countdown-dot").classList.toggle(
    "neutral",
    !timer.running && !timer.finished,
  );
  fields.disabled = touched || !!pending;
  el("phase-counter").textContent =
    mode === "countdown"
      ? timer.finished
        ? "COMPLETE"
        : "YOUR NEXT MOMENT"
      : `ROUND ${timer.phase.round} OF ${Math.max(...timer.phases.map((phase) => phase.round))}`;
  el("next-phase").textContent = timer.finished
    ? "Take a breath. You made time for it."
    : timer.phases[timer.index + 1]
      ? `Up next: ${timer.phases[timer.index + 1].label} · ${formatTime(timer.phases[timer.index + 1].duration).split(".")[0]}`
      : "One moment at a time.";
  const progress = Math.min(100, Math.max(0, timer.progress * 100));
  el("countdown-progress-fill").style.width = `${progress}%`;
  document
    .querySelector("[role=progressbar]")!
    .setAttribute("aria-valuenow", String(Math.round(progress)));
  document.title = timer.running
    ? `${time.hours}:${time.minutes}:${time.seconds} · ${timer.phase.label} · Online Stopwatch`
    : timer.finished
      ? `Time’s up · Online Stopwatch`
      : title;
}
async function unlockSound() {
  if (!sound.checked) return;
  try {
    if (!audio || audio.state === "closed") audio = new AudioContext();
    await audio.resume();
  } catch {
    message(
      "Sound is unavailable in this browser. The visual timer still works.",
    );
  }
}
function chime() {
  if (!sound.checked || !audio || audio.state !== "running") return;
  try {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = 660;
    const start = audio.currentTime;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.65);
    oscillator.start(start);
    oscillator.stop(start + 0.7);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  } catch {
    message("Sound could not play. Check your browser’s audio settings.");
  }
}
function apply() {
  const next = phases();
  if (!next) return false;
  error();
  timer = new Countdown(next);
  touched = false;
  completedRecorded = false;
  updatePreview();
  save();
  render();
  return true;
}
const routineDialog = el<HTMLDialogElement>("routine-dialog");
el("save-routine").addEventListener("click", () => {
  if (!phases()) return;
  routineDialog.showModal();
  el<HTMLInputElement>("routine-name").focus();
});
el<HTMLFormElement>("routine-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = el<HTMLInputElement>("routine-name").value.trim();
  if (!name || !form.reportValidity()) return;
  try {
    const item = { id: crypto.randomUUID(), name, mode: mode as RoutineMode, inputs: inputValues(), createdAt: Date.now() };
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(addRoutine(parseRoutines(localStorage.getItem(ROUTINES_KEY)), item)));
    routineDialog.close();
    el<HTMLInputElement>("routine-name").value = "";
    message(`“${name}” saved. Find it on the stopwatch home page.`);
  } catch {
    message("This browser could not save the routine.");
  }
});
el("routine-cancel").addEventListener("click", () => routineDialog.close());
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!touched && !pending && apply())
    message("Your timer is ready. Press Start when you are.");
});
form.addEventListener("input", () => {
  error();
});
document
  .querySelectorAll<HTMLButtonElement>("[data-preset]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      const minutes = Number(button.dataset.preset);
      input("duration-hours").value = String(Math.floor(minutes / 60));
      input("duration-minutes").value = String(minutes % 60);
      input("duration-seconds").value = "0";
      apply();
      message(`${minutes} minute timer ready.`);
    }),
  );
el("countdown-toggle").addEventListener("click", () => {
  if (pending) return;
  if (timer.running) {
    timer.pause();
    message(timer.finished ? "Session complete." : "Timer paused.");
  } else {
    if (!touched && !apply()) return;
    if (timer.finished) timer.reset();
    void unlockSound();
    timer.start();
    touched = true;
    message(`${timer.phase.label} started.`);
  }
  save();
  render();
});
function requestReset(discard = false) {
  discardPending = discard;
  resetDialog.showModal();
  el("timer-reset-cancel").focus();
}
el("countdown-reset").addEventListener("click", () => requestReset());
el("timer-discard").addEventListener("click", () => requestReset(true));
el("timer-reset-cancel").addEventListener("click", () => resetDialog.close());
el("timer-reset-confirm").addEventListener("click", () => {
  pending = null;
  timer.reset();
  touched = false;
  completedRecorded = false;
  fields.disabled = false;
  el("timer-recovery").hidden = true;
  resetDialog.close();
  apply();
  message(
    discardPending
      ? "Saved session discarded. Ready for a new moment."
      : "Timer reset. You can edit your routine.",
  );
  el("countdown-toggle").focus();
});
el("timer-restore").addEventListener("click", () => {
  if (!pending) return;
  timer.restore(pending);
  pending = null;
  touched = true;
  completedRecorded = timer.finished;
  el("timer-recovery").hidden = true;
  save();
  updatePreview();
  render();
  message(
    timer.finished
      ? "Your saved timer completed while you were away."
      : "Session restored and paused. Resume when you’re ready.",
  );
});
el("test-sound").addEventListener("click", async () => {
  if (!sound.checked) {
    message("Turn on “Sound on completion” to test the alert.");
    return;
  }
  await unlockSound();
  chime();
  if (audio?.state === "running")
    message("Test tone played. Check your device volume.");
});
sound.addEventListener("change", () => {
  if (sound.checked) void unlockSound();
  save();
});
function tick() {
  const index = timer.index;
  const finished = timer.finished;
  timer.tick();
  if (timer.index !== index || timer.finished !== finished) {
    chime();
    message(
      timer.finished
        ? "Session complete. Well done."
        : `${timer.phase.label} started. Round ${timer.phase.round}.`,
    );
  }
  if (timer.finished && !completedRecorded) {
    completedRecorded = true;
    try {
      const label =
        mode === "countdown"
          ? "Countdown"
          : mode === "pomodoro"
            ? "Pomodoro session"
            : "Interval session";
      const session = {
        id: crypto.randomUUID(),
        mode: mode as RoutineMode,
        label,
        duration: timer.total,
        completedAt: Date.now(),
      };
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(addSession(parseHistory(localStorage.getItem(HISTORY_KEY)), session)),
      );
    } catch {}
  }
  render();
}
setInterval(tick, 200);
setInterval(() => {
  if (timer.running) save();
}, 1000);
document.addEventListener("visibilitychange", () => {
  tick();
  if (touched) save();
});
window.addEventListener("pagehide", () => {
  if (touched) save();
  void audio?.close();
});
function setFocus(enabled: boolean) {
  card.classList.toggle("focus-mode", enabled);
  document.body.classList.toggle("in-focus", enabled);
  for (const selector of [
    ".site-header",
    ".hero",
    ".site-toolbox",
    ".tool-nav",
    ".timer-setup",
    ".timer-browser-note",
    ".routine-summary",
    ".tool-help",
    ".site-footer",
  ]) {
    const node = document.querySelector<HTMLElement>(selector);
    if (node) node.inert = enabled;
  }
  el("timer-fullscreen-label").textContent = enabled
    ? "Exit fullscreen"
    : "Fullscreen";
}
el("timer-fullscreen").addEventListener("click", async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {});
    return;
  }
  if (card.classList.contains("focus-mode")) {
    setFocus(false);
    return;
  }
  try {
    if (!card.requestFullscreen) throw new Error();
    await card.requestFullscreen();
  } catch {
    setFocus(true);
  }
});
document.addEventListener("fullscreenchange", () => {
  el("timer-fullscreen-label").textContent = document.fullscreenElement
    ? "Exit fullscreen"
    : "Fullscreen";
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !resetDialog.open &&
    card.classList.contains("focus-mode")
  ) {
    setFocus(false);
    el("timer-fullscreen").focus();
  }
});
if (
  pending &&
  (pending.running ||
    pending.finished ||
    pending.index > 0 ||
    pending.remaining < pending.phases[0].duration)
)
  el("timer-recovery").hidden = false;
else pending = null;
updatePreview();
render();
