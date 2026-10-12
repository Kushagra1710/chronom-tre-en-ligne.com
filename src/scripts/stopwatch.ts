import { clearLocalData } from "../lib/storage";
import { customDefaults, parseCustomization } from "../lib/customization";
import {
  Stopwatch,
  parseSnapshot,
  parts,
  formatTime,
  lapDurations,
  csv,
  MAX_LAPS,
} from "../lib/stopwatch";
const byId = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const button = (id: string) => byId<HTMLButtonElement>(id);
const watch = new Stopwatch();
const variant =
  document.querySelector<HTMLElement>("[data-stopwatch-variant]")!.dataset
    .stopwatchVariant || "digital";
const originalTitle = document.title;
const key =
  variant === "digital" ? "rs-session-v1" : `rs-session-${variant}-v1`;
const customKey = "rs-custom-v1";
let custom = { ...customDefaults };
const settingsKey =
  variant === "digital" ? "rs-settings-v1" : `rs-settings-${variant}-v1`;
const settingsDialog = byId<HTMLDialogElement>("settings-dialog");
const resetDialog = byId<HTMLDialogElement>("reset-dialog");
const card = byId("stopwatch");
let pending = null as ReturnType<typeof parseSnapshot>;
let clearAll = false;
let page = 0;
const pageSize = 20;
let animation = 0;
let lastFrame = 0;
let toastTimer: ReturnType<typeof setTimeout>;
let storageAvailable = true;
let wakeLock: WakeLockSentinel | null = null;
let wakeRequested = false;
let settings = {
  fractions: variant !== "minimal",
  shortcuts: true,
  wake: false,
};
try {
  const saved = JSON.parse(localStorage.getItem(settingsKey) || "null");
  if (saved)
    for (const name of ["fractions", "shortcuts", "wake"] as const)
      if (typeof saved[name] === "boolean") settings[name] = saved[name];
  pending = parseSnapshot(localStorage.getItem(key));
  if (variant === "custom")
    custom = parseCustomization(
      JSON.parse(localStorage.getItem(customKey) || "null"),
    );
} catch {
  storageAvailable = false;
}
if (variant === "custom") {
  const params = new URLSearchParams(location.search);
  if (params.get("setup") === "1") {
    const raw: Record<string, unknown> = Object.fromEntries(params);
    for (const name of ["fractions", "laps"])
      if (params.has(name)) raw[name] = params.get(name) === "true";
    custom = parseCustomization(raw);
  }
  settings.fractions = custom.fractions;
}
function applyCustom() {
  if (variant !== "custom") return;
  for (const name of [
    "face",
    "palette",
    "font",
    "size",
    "background",
  ] as const) {
    card.dataset[name] = custom[name];
    byId<HTMLSelectElement>(`custom-${name}`).value = custom[name];
  }
  byId<HTMLInputElement>("custom-title").value = custom.title;
  byId("custom-session-title").textContent = custom.title;
  byId("custom-session-title").hidden = !custom.title.trim();
  byId<HTMLInputElement>("custom-fractions").checked = custom.fractions;
  byId<HTMLInputElement>("custom-laps").checked = custom.laps;
  document.querySelector<HTMLElement>(".session-grid")!.hidden = !custom.laps;
  settings.fractions = custom.fractions;
  applySettings();
}
function saveCustom() {
  try {
    localStorage.setItem(customKey, JSON.stringify(custom));
    byId("custom-save-note").textContent = "Enregistré sur cet appareil";
  } catch {
    byId("custom-save-note").textContent = "Stockage indisponible";
  }
  // Remove an imported setup once edited so reload uses the latest local choices.
  if (location.search) history.replaceState(null, "", location.pathname);
}
function announce(text: string) {
  byId("announcement").textContent = text;
}
function toast(text: string) {
  const node = byId("toast");
  node.textContent = text;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    node.hidden = true;
  }, 4000);
}
function storageFailed() {
  storageAvailable = false;
  byId("save-status").textContent =
    "Stockage indisponible — exportez vos tours pour les conserver";
}
function save() {
  if (pending) return;
  try {
    localStorage.setItem(key, JSON.stringify(watch.snapshot()));
    storageAvailable = true;
    byId("save-status").textContent = "Votre séance reste sur cet appareil";
  } catch {
    storageFailed();
  }
}
function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  } catch {
    storageFailed();
  }
}
function applySettings() {
  card.classList.toggle("no-fractions", !settings.fractions);
  byId<HTMLInputElement>("show-fractions").checked = settings.fractions;
  byId<HTMLInputElement>("enable-shortcuts").checked = settings.shortcuts;
  byId<HTMLInputElement>("keep-awake").checked = settings.wake;
  document.querySelector<HTMLElement>(".under-tool")!.hidden =
    !settings.shortcuts;
  document
    .querySelectorAll<HTMLElement>(".timer-actions kbd, #fullscreen kbd")
    .forEach((node) => {
      node.hidden = !settings.shortcuts;
    });
}
function paint() {
  const value = watch.elapsed;
  const time = parts(value);
  const secondHand = document.getElementById("second-hand");
  const minuteHand = document.getElementById("minute-hand");
  if (card.dataset.face === "analog") {
    const dialValue = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? Math.floor(value / 1000) * 1000
      : value;
    secondHand?.setAttribute(
      "transform",
      `rotate(${((dialValue % 60000) / 60000) * 360} 120 120)`,
    );
    minuteHand?.setAttribute(
      "transform",
      `rotate(${((dialValue % 3600000) / 3600000) * 360} 120 120)`,
    );
  }
  byId("time-hours").textContent = time.hours;
  byId("time-minutes").textContent = time.minutes;
  byId("time-seconds").textContent = time.seconds;
  byId("time-fraction").textContent = `.${time.fraction}`;
  if (watch.laps.length)
    byId("current-lap").textContent =
      `Tour en cours  ${formatTime(value - watch.laps[watch.laps.length - 1].split)}`;
  else
    byId("current-lap").textContent = watch.running
      ? "Le chronomètre est lancé. Suivez votre rythme."
      : value
        ? "Prenez une pause. Reprenez quand vous le souhaitez."
        : "Une activité. Un chrono. Votre rythme.";
}
function tick(now: number) {
  if (!watch.running) return;
  if (now - lastFrame > 30) {
    paint();
    lastFrame = now;
  }
  animation = requestAnimationFrame(tick);
}
function renderState() {
  paint();
  byId("toggle-label").textContent = watch.running
    ? "Pause"
    : watch.elapsed > 0
      ? "Reprendre"
      : "Démarrer";
  byId("play-icon").hidden = watch.running;
  byId("pause-icon").hidden = !watch.running;
  byId("run-status").textContent = pending
    ? "Restaurez votre séance précédente"
    : watch.running
      ? "Chronométrage en cours"
      : watch.elapsed > 0
        ? "En pause. Prenez votre temps."
        : "Prêt à démarrer";
  byId("run-dot").classList.toggle("neutral", !watch.running);
  button("toggle").disabled = Boolean(pending);
  button("lap").disabled = !watch.running || watch.laps.length >= MAX_LAPS;
  button("reset").disabled = !watch.elapsed && !pending;
  button("copy").disabled = button("export").disabled = watch.laps.length === 0;
  cancelAnimationFrame(animation);
  if (watch.running) animation = requestAnimationFrame(tick);
  document.title = watch.running
    ? `${formatTime(watch.elapsed).split(".")[0]} · Chronomètre en ligne`
    : originalTitle;
  void updateWakeLock();
}
function renderLaps() {
  const laps = watch.laps;
  const durations = lapDurations(laps);
  const best = laps.length ? Math.min(...durations) : 0;
  const slow = laps.length ? Math.max(...durations) : 0;
  byId("empty-laps").hidden = laps.length > 0;
  byId("lap-records").hidden = laps.length === 0;
  byId("lap-count").textContent = new Intl.NumberFormat("fr-FR").format(
    laps.length,
  );
  byId("fastest").textContent = laps.length ? formatTime(best) : "—";
  byId("slowest").textContent = laps.length ? formatTime(slow) : "—";
  byId("average").textContent = laps.length
    ? formatTime(laps[laps.length - 1].split / laps.length)
    : "—";
  byId("summary-note").textContent = laps.length
    ? `${laps.length.toLocaleString("fr-FR")} ${laps.length === 1 ? "tour enregistré" : "tours enregistrés"}. Continuez.`
    : "Suivez vos progrès, tour après tour.";
  const body = byId("lap-body");
  body.replaceChildren();
  page = Math.min(page, Math.max(0, Math.ceil(laps.length / pageSize) - 1));
  const end = laps.length - page * pageSize;
  const begin = Math.max(0, end - pageSize);
  for (let i = end - 1; i >= begin; i--) {
    const tr = document.createElement("tr");
    if (durations[i] === best && laps.length > 1) tr.className = "best-lap";
    const labelCell = document.createElement("td");
    const number = document.createElement("span");
    number.className = "lap-number";
    number.textContent = String(i + 1).padStart(2, "0");
    const input = document.createElement("input");
    input.value = laps[i].label;
    input.maxLength = 80;
    input.name = `lap-${i + 1}`;
    input.autocomplete = "off";
    input.placeholder = "Ajouter un nom…";
    input.setAttribute("aria-label", `Nom du tour ${i + 1}`);
    input.addEventListener("input", () => {
      laps[i].label = input.value;
      save();
    });
    labelCell.append(number, input);
    tr.append(labelCell);
    for (const value of [durations[i], laps[i].split]) {
      const cell = document.createElement("td");
      cell.textContent = formatTime(value);
      tr.append(cell);
    }
    body.append(tr);
  }
  byId("lap-page-status").textContent = laps.length
    ? `${begin + 1}–${end} sur ${laps.length}`
    : "";
  button("previous-laps").disabled = page === 0;
  button("next-laps").disabled = begin === 0;
}
function toggle() {
  if (pending) return;
  if (watch.running) watch.pause();
  else watch.start();
  announce(
    watch.running
      ? "Chronomètre démarré."
      : `Chronomètre en pause à ${formatTime(watch.elapsed)}.`,
  );
  save();
  renderState();
}
function recordLap() {
  const lap = watch.lap();
  if (!lap) return;
  page = 0;
  save();
  renderLaps();
  renderState();
  announce(
    `Tour ${watch.laps.length} enregistré, ${formatTime(lapDurations(watch.laps).at(-1)!)}.`,
  );
  if (watch.laps.length === MAX_LAPS)
    toast(
      "Limite de tours atteinte. Exportez vos résultats avant de recommencer.",
    );
}
function requestReset(all = false) {
  if (!all && !watch.elapsed && !pending) return;
  clearAll = all;
  byId("reset-title").textContent = all
    ? "Effacer les données de cet appareil ?"
    : "Commencer une nouvelle séance ?";
  byId("reset-description").textContent = all
    ? "Toutes les séances, tous les tours et toutes les préférences seront effacés de ce navigateur. Exportez d’abord les résultats à conserver."
    : "Le chronomètre et les tours seront effacés. Exportez d’abord les résultats que vous souhaitez conserver.";
  byId("confirm-reset").textContent = all
    ? "Effacer les données locales"
    : "Réinitialiser la séance";
  resetDialog.showModal();
  resetDialog.querySelector<HTMLButtonElement>("[data-close-dialog]")?.focus();
}
function confirmReset() {
  watch.reset();
  pending = null;
  byId("recovery").hidden = true;
  page = 0;
  try {
    localStorage.removeItem(key);
  } catch {
    storageFailed();
  }
  if (clearAll) {
    try {
      clearLocalData();
    } catch {
      storageFailed();
    }
    settings = {
      fractions: variant !== "minimal",
      shortcuts: true,
      wake: false,
    };
    custom = { ...customDefaults };
    if (variant === "custom") history.replaceState(null, "", location.pathname);
    applyCustom();
    applySettings();
    const select = byId<HTMLSelectElement>("theme-choice");
    select.value = "system";
    select.dispatchEvent(new Event("change"));
    try {
      localStorage.removeItem("rs-theme");
    } catch {}
    settingsDialog.close();
  }
  resetDialog.close();
  renderLaps();
  renderState();
  toast(
    clearAll
      ? "Données locales effacées."
      : "Nouvelle séance prête à démarrer.",
  );
  button("toggle").focus();
}
function restore() {
  if (!pending) return;
  watch.restore(pending);
  pending = null;
  byId("recovery").hidden = true;
  save();
  renderLaps();
  renderState();
  toast("Séance restaurée et mise en pause. Reprenez quand vous le souhaitez.");
}
function setFocusMode(enabled: boolean) {
  card.classList.toggle("focus-mode", enabled);
  document.body.classList.toggle("in-focus", enabled);
  // In fallback focus mode, hide surrounding content from keyboard and assistive tech.
  const outside = [
    ".site-header",
    ".hero",
    ".under-tool",
    ".session-grid",
    ".why-section",
    ".faq-section",
    ".closing-note",
    ".site-footer",
    ".site-toolbox",
    ".tool-nav",
    ".tool-directory",
    ".tool-help",
    ".custom-controls",
    ".minimal-records",
  ];
  outside.forEach((selector) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) element.inert = enabled;
  });
  updateFullscreenLabel();
}
function updateFullscreenLabel() {
  byId("fullscreen-label").textContent =
    document.fullscreenElement || card.classList.contains("focus-mode")
      ? "Quitter le plein écran"
      : "Plein écran";
}
async function fullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {});
    return;
  }
  if (card.classList.contains("focus-mode")) {
    setFocusMode(false);
    button("fullscreen").focus();
    return;
  }
  try {
    if (!card.requestFullscreen) throw new Error("Unavailable");
    await card.requestFullscreen();
  } catch {
    setFocusMode(true);
    button("fullscreen").focus();
  }
}
async function updateWakeLock() {
  if (!("wakeLock" in navigator)) return;
  if (!settings.wake || !watch.running || document.hidden) {
    const lock = wakeLock;
    wakeLock = null;
    if (lock) await lock.release().catch(() => {});
    return;
  }
  if (wakeLock || wakeRequested) return;
  wakeRequested = true;
  try {
    const lock = await navigator.wakeLock.request("screen");
    if (!settings.wake || !watch.running || document.hidden) {
      await lock.release();
      return;
    }
    wakeLock = lock;
    byId("wake-description").textContent =
      "L’écran reste allumé tant que cet onglet est visible.";
    lock.addEventListener("release", () => {
      if (wakeLock === lock) wakeLock = null;
      byId("wake-description").textContent =
        "Pendant le fonctionnement du chronomètre.";
    });
  } catch {
    byId("wake-description").textContent =
      "Indisponible pour le moment. Le chronomètre fonctionne toujours.";
  } finally {
    wakeRequested = false;
  }
}
button("toggle").addEventListener("click", toggle);
button("lap").addEventListener("click", recordLap);
button("reset").addEventListener("click", () => requestReset());
button("confirm-reset").addEventListener("click", confirmReset);
button("restore").addEventListener("click", restore);
button("discard").addEventListener("click", () => requestReset());
button("settings-open").addEventListener("click", () =>
  settingsDialog.showModal(),
);
button("clear-data").addEventListener("click", () => requestReset(true));
button("fullscreen").addEventListener("click", () => {
  void fullscreen();
});
button("previous-laps").addEventListener("click", () => {
  page--;
  renderLaps();
});
button("next-laps").addEventListener("click", () => {
  page++;
  renderLaps();
});
button("export").addEventListener("click", () => {
  const url = URL.createObjectURL(
    new Blob([csv(watch.laps)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `chronometre-en-ligne-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  toast("Votre export des tours est prêt.");
});
button("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(csv(watch.laps).replace(/^\uFEFF/, ""));
    toast("Temps par tour copiés.");
  } catch {
    toast(
      "Presse-papiers indisponible. Utilisez l’export CSV pour conserver vos tours.",
    );
  }
});
document
  .querySelectorAll<HTMLElement>("[data-close-dialog]")
  .forEach((node) =>
    node.addEventListener("click", () => node.closest("dialog")?.close()),
  );
for (const [id, name] of [
  ["show-fractions", "fractions"],
  ["enable-shortcuts", "shortcuts"],
  ["keep-awake", "wake"],
] as const) {
  byId<HTMLInputElement>(id).addEventListener("change", (event) => {
    settings[name] = (event.target as HTMLInputElement).checked;
    if (variant === "custom" && name === "fractions") {
      custom.fractions = settings.fractions;
      byId<HTMLInputElement>("custom-fractions").checked = custom.fractions;
      saveCustom();
    }
    applySettings();
    saveSettings();
    void updateWakeLock();
  });
}
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    card.classList.contains("focus-mode") &&
    !document.querySelector("dialog[open]")
  ) {
    setFocusMode(false);
    button("fullscreen").focus();
    return;
  }
  if (
    !settings.shortcuts ||
    event.repeat ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    document.querySelector("dialog[open]")
  )
    return;
  if (
    (event.target as HTMLElement).closest(
      'input, textarea, select, [contenteditable="true"]',
    )
  )
    return;
  if (
    [" ", "Enter"].includes(event.key) &&
    (event.target as HTMLElement).closest("button, a, summary")
  )
    return;
  const name = event.key.toLowerCase();
  if ([" ", "enter", "l", "r", "f"].includes(name)) event.preventDefault();
  if (name === " " || name === "enter") toggle();
  else if (name === "l") recordLap();
  else if (name === "r") requestReset();
  else if (name === "f") void fullscreen();
});
document.addEventListener("fullscreenchange", updateFullscreenLabel);
document.addEventListener("visibilitychange", () => {
  save();
  if (!document.hidden) {
    paint();
    void updateWakeLock();
  }
});
window.addEventListener("pagehide", () => {
  if (watch.elapsed || watch.laps.length) save();
});
setInterval(() => {
  if (watch.running) {
    save();
    document.title = `${formatTime(watch.elapsed).split(".")[0]} · Chronomètre en ligne`;
  }
}, 1000);
if (pending && (pending.elapsed || pending.laps.length)) {
  byId("recovery").hidden = false;
  byId("recovery-detail").textContent = pending.running
    ? "Une séance en cours a été enregistrée. La restauration inclut le temps d’absence puis met la séance en pause."
    : `Votre séance en pause à ${formatTime(pending.elapsed)} peut être restaurée.`;
} else pending = null;
if (!("wakeLock" in navigator)) {
  byId<HTMLInputElement>("keep-awake").disabled = true;
  byId("wake-description").textContent =
    "Non pris en charge par ce navigateur.";
  settings.wake = false;
}
if (!storageAvailable) storageFailed();
if (variant === "minimal") {
  const control = button("minimal-records");
  control.addEventListener("click", () => {
    const records = document.querySelector<HTMLElement>(".session-grid")!;
    records.hidden = !records.hidden;
    control.setAttribute("aria-expanded", String(!records.hidden));
    control.textContent = records.hidden
      ? "Afficher les tours"
      : "Masquer les tours";
  });
}
if (variant === "custom") {
  for (const name of [
    "title",
    "face",
    "palette",
    "font",
    "size",
    "background",
    "fractions",
    "laps",
  ] as const) {
    byId(`custom-${name}`).addEventListener("input", (event) => {
      const input = event.target as HTMLInputElement;
      if (name === "fractions" || name === "laps") custom[name] = input.checked;
      else custom[name] = input.value;
      custom = parseCustomization(custom);
      applyCustom();
      saveCustom();
      paint();
    });
  }
  button("share-custom").addEventListener("click", async () => {
    const params = new URLSearchParams({ setup: "1" });
    for (const [name, value] of Object.entries(custom))
      params.set(name, String(value));
    const url = `${location.origin}${location.pathname}?${params}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Lien de personnalisation copié. Vos tours restent privés.");
    } catch {
      toast(
        "Presse-papiers indisponible. Copiez le lien dans la barre d’adresse.",
      );
      history.replaceState(null, "", url);
    }
  });
  applyCustom();
}
applySettings();
renderLaps();
renderState();
