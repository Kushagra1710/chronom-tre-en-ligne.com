import {
  HISTORY_KEY,
  ROUTINES_KEY,
  parseHistory,
  parseRoutines,
  routinePath,
  todaySummary,
  type SavedRoutine,
} from "../lib/routines";

const panel = document.getElementById("today-dashboard")!;
const formatDuration = (milliseconds: number) => {
  const minutes = Math.round(milliseconds / 60000);
  return minutes < 1 ? "less than a minute" : `${minutes} min`;
};
const formatWhen = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(timestamp);

function routineLine(routine: SavedRoutine) {
  const anchor = document.createElement("a");
  anchor.href = routinePath(routine);
  anchor.className = "today-row";
  const name = document.createElement("strong");
  name.textContent = routine.name;
  const meta = document.createElement("span");
  meta.textContent = routine.mode === "countdown" ? "Countdown" : routine.mode === "pomodoro" ? "Pomodoro" : "Interval timer";
  anchor.append(name, meta);
  return anchor;
}
function render() {
  const routines = parseRoutines(localStorage.getItem(ROUTINES_KEY));
  const history = parseHistory(localStorage.getItem(HISTORY_KEY));
  const summary = todaySummary(history);
  const routinesNode = document.getElementById("saved-routines")!;
  const historyNode = document.getElementById("recent-sessions")!;
  document.getElementById("today-progress")!.textContent = `${summary.count} completed ${summary.count === 1 ? "session" : "sessions"}`;
  document.getElementById("today-duration")!.textContent = summary.count ? `${formatDuration(summary.duration)} of intentional time today.` : "Finish a timer to begin your daily record.";
  routinesNode.replaceChildren(...routines.slice(0, 3).map(routineLine));
  if (!routines.length) routinesNode.textContent = "Save any timer setup as a routine to start it again in one click.";
  historyNode.replaceChildren();
  history.slice(0, 3).forEach((session) => {
    const row = document.createElement("div");
    row.className = "today-row";
    const name = document.createElement("strong");
    name.textContent = session.label;
    const meta = document.createElement("span");
    meta.textContent = `${formatDuration(session.duration)} · ${formatWhen(session.completedAt)}`;
    row.append(name, meta);
    historyNode.append(row);
  });
  if (!history.length) historyNode.textContent = "Completed timer sessions stay on this device.";
  panel.hidden = false;
}
try {
  render();
  window.addEventListener("storage", render);
} catch {
  panel.hidden = true;
}
