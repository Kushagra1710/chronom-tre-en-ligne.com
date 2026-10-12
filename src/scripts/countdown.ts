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
  el("timer-storage-note").textContent = "Stockage indisponible";
}
function inputValues() {
  return Object.fromEntries(
    Array.from(
      form.querySelectorAll<HTMLInputElement>("input[type=number]"),
    ).map((node) => [node.id, node.valueAsNumber]),
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
      if (
        node &&
        Number.isInteger(next) &&
        next >= Number(node.min) &&
        next <= Number(node.max)
      )
        node.value = String(next);
    });
    // Choosing a named routine is an intentional fresh start, not a recovery.
    pending = null;
    el("timer-storage-note").textContent = `Programme : ${savedRoutine.name}`;
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
      error("Choisissez une durée d’au moins 1 seconde.");
      input("duration-seconds").focus();
      return null;
    }
    return [{ label: "Compte à rebours", duration, round: 1 }];
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
  phases() || [{ label: "Compte à rebours", duration: 300000, round: 1 }],
);
function save() {
  if (pending) return;
  const inputs = inputValues();
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ ...timer.snapshot(), inputs, sound: sound.checked }),
    );
    el("timer-storage-note").textContent = "Enregistré sur cet appareil";
  } catch {
    el("timer-storage-note").textContent = "Stockage indisponible";
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
    item.textContent = `+ ${timer.phases.length - 6} phases supplémentaires`;
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
    ? "Votre séance est terminée."
    : mode === "countdown"
      ? "Votre compte à rebours"
      : timer.phase.label;
  el("countdown-state").textContent = pending
    ? "Votre séance enregistrée est prête"
    : timer.finished
      ? "Séance terminée"
      : timer.running
        ? "Chronométrage en cours"
        : touched
          ? "En pause. Prenez votre temps."
          : "Prêt à démarrer";
  el("countdown-toggle-label").textContent = timer.finished
    ? "Recommencer"
    : timer.running
      ? "Pause"
      : touched
        ? "Reprendre"
        : "Démarrer";
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
        ? "TERMINÉ"
        : "VOTRE COMPTE À REBOURS"
      : `CYCLE ${timer.phase.round} SUR ${Math.max(...timer.phases.map((phase) => phase.round))}`;
  el("next-phase").textContent = timer.finished
    ? "La séance est terminée. Prenez une pause."
    : timer.phases[timer.index + 1]
      ? `Ensuite : ${timer.phases[timer.index + 1].label} · ${formatTime(timer.phases[timer.index + 1].duration).split(".")[0]}`
      : "Une activité à la fois.";
  const progress = Math.min(100, Math.max(0, timer.progress * 100));
  el("countdown-progress-fill").style.width = `${progress}%`;
  document
    .querySelector("[role=progressbar]")!
    .setAttribute("aria-valuenow", String(Math.round(progress)));
  document.title = timer.running
    ? `${time.hours}:${time.minutes}:${time.seconds} · ${timer.phase.label} · Chronomètre en ligne`
    : timer.finished
      ? `Temps écoulé · Chronomètre en ligne`
      : title;
}
async function unlockSound() {
  if (!sound.checked) return;
  try {
    if (!audio || audio.state === "closed") audio = new AudioContext();
    await audio.resume();
  } catch {
    message(
      "Le son est indisponible dans ce navigateur. L’affichage du minuteur fonctionne toujours.",
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
    message(
      "Le son n’a pas pu être joué. Vérifiez les réglages audio du navigateur.",
    );
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
    const item = {
      id: crypto.randomUUID(),
      name,
      mode: mode as RoutineMode,
      inputs: inputValues(),
      createdAt: Date.now(),
    };
    localStorage.setItem(
      ROUTINES_KEY,
      JSON.stringify(
        addRoutine(parseRoutines(localStorage.getItem(ROUTINES_KEY)), item),
      ),
    );
    routineDialog.close();
    el<HTMLInputElement>("routine-name").value = "";
    message(
      `« ${name} » enregistré. Retrouvez ce programme sur la page d’accueil.`,
    );
  } catch {
    message("Ce navigateur n’a pas pu enregistrer le programme.");
  }
});
el("routine-cancel").addEventListener("click", () => routineDialog.close());
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!touched && !pending && apply())
    message("Votre minuteur est prêt. Appuyez sur Démarrer.");
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
      message(`Minuteur de ${minutes} min prêt.`);
    }),
  );
el("countdown-toggle").addEventListener("click", () => {
  if (pending) return;
  if (timer.running) {
    timer.pause();
    message(timer.finished ? "Séance terminée." : "Minuteur en pause.");
  } else {
    if (!touched && !apply()) return;
    if (timer.finished) timer.reset();
    void unlockSound();
    timer.start();
    touched = true;
    message(`${timer.phase.label} : démarrage.`);
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
      ? "Séance enregistrée supprimée. Vous pouvez recommencer."
      : "Minuteur réinitialisé. Vous pouvez modifier le programme.",
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
      ? "Votre minuteur s’est terminé pendant votre absence."
      : "Séance restaurée et mise en pause. Reprenez quand vous le souhaitez.",
  );
});
el("test-sound").addEventListener("click", async () => {
  if (!sound.checked) {
    message("Activez « Son à la fin » pour tester l’alerte.");
    return;
  }
  await unlockSound();
  chime();
  if (audio?.state === "running")
    message("Son de test joué. Vérifiez le volume de votre appareil.");
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
        ? "Séance terminée. Bravo !"
        : `${timer.phase.label} : début du cycle ${timer.phase.round}.`,
    );
  }
  if (timer.finished && !completedRecorded) {
    completedRecorded = true;
    try {
      const label =
        mode === "countdown"
          ? "Compte à rebours"
          : mode === "pomodoro"
            ? "Séance Pomodoro"
            : "Séance d’intervalles";
      const session = {
        id: crypto.randomUUID(),
        mode: mode as RoutineMode,
        label,
        duration: timer.total,
        completedAt: Date.now(),
      };
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(
          addSession(parseHistory(localStorage.getItem(HISTORY_KEY)), session),
        ),
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
    ? "Quitter le plein écran"
    : "Plein écran";
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
    ? "Quitter le plein écran"
    : "Plein écran";
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
