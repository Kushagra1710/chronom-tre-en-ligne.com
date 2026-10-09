export type RoutineMode = "countdown" | "pomodoro" | "interval";

export interface SavedRoutine {
  id: string;
  name: string;
  mode: RoutineMode;
  inputs: Record<string, number>;
  createdAt: number;
}

export interface RecentSession {
  id: string;
  mode: RoutineMode;
  label: string;
  duration: number;
  completedAt: number;
}

export const ROUTINES_KEY = "os-routines-v1";
export const HISTORY_KEY = "os-history-v1";
const modes = new Set<RoutineMode>(["countdown", "pomodoro", "interval"]);

function validInputs(value: unknown): value is Record<string, number> {
  return !!value && typeof value === "object" && Object.values(value).every(
    (item) => Number.isInteger(item) && item >= 0 && item <= 86400,
  );
}

export function parseRoutines(raw: string | null): SavedRoutine[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item): item is SavedRoutine =>
          !!item &&
          typeof item === "object" &&
          typeof (item as SavedRoutine).id === "string" &&
          typeof (item as SavedRoutine).name === "string" &&
          (item as SavedRoutine).name.trim().length > 0 &&
          (item as SavedRoutine).name.length <= 60 &&
          modes.has((item as SavedRoutine).mode) &&
          validInputs((item as SavedRoutine).inputs) &&
          Number.isFinite((item as SavedRoutine).createdAt),
      )
      .slice(0, 24);
  } catch {
    return [];
  }
}

export function parseHistory(raw: string | null): RecentSession[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item): item is RecentSession =>
          !!item &&
          typeof item === "object" &&
          typeof (item as RecentSession).id === "string" &&
          modes.has((item as RecentSession).mode) &&
          typeof (item as RecentSession).label === "string" &&
          (item as RecentSession).label.length <= 80 &&
          Number.isFinite((item as RecentSession).duration) &&
          (item as RecentSession).duration > 0 &&
          Number.isFinite((item as RecentSession).completedAt),
      )
      .slice(0, 40);
  } catch {
    return [];
  }
}

export function addRoutine(items: SavedRoutine[], item: SavedRoutine) {
  return [item, ...items.filter((existing) => existing.id !== item.id)].slice(0, 24);
}

export function addSession(items: RecentSession[], item: RecentSession) {
  return [item, ...items].slice(0, 40);
}

export function todaySummary(items: RecentSession[], now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const today = items.filter((item) => item.completedAt >= start && item.completedAt <= now.getTime());
  return { count: today.length, duration: today.reduce((sum, item) => sum + item.duration, 0) };
}

export function routinePath(routine: SavedRoutine) {
  const path = routine.mode === "countdown" ? "/timer/" : routine.mode === "pomodoro" ? "/pomodoro/" : "/interval-timer/";
  return `${path}?routine=${encodeURIComponent(routine.id)}`;
}
