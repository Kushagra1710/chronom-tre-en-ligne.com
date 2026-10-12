export interface Lap {
  split: number;
  label: string;
}
export interface Snapshot {
  version: 1;
  elapsed: number;
  running: boolean;
  savedAt: number;
  laps: Lap[];
}
export const MAX_LAPS = 10000;
export class Stopwatch {
  private accumulated = 0;
  private startedAt = 0;
  running = false;
  laps: Lap[] = [];
  private clock: () => number;
  constructor(clock: () => number = () => performance.now()) {
    this.clock = clock;
  }
  get elapsed() {
    return (
      this.accumulated +
      (this.running ? Math.max(0, this.clock() - this.startedAt) : 0)
    );
  }
  start() {
    if (!this.running) {
      this.startedAt = this.clock();
      this.running = true;
    }
  }
  pause() {
    if (this.running) {
      this.accumulated = this.elapsed;
      this.running = false;
    }
  }
  lap() {
    if (!this.running || this.laps.length >= MAX_LAPS) return null;
    const lap = { split: this.elapsed, label: "" };
    this.laps.push(lap);
    return lap;
  }
  reset() {
    this.running = false;
    this.accumulated = 0;
    this.laps = [];
  }
  snapshot(wall = Date.now()): Snapshot {
    return {
      version: 1,
      elapsed: this.elapsed,
      running: this.running,
      savedAt: wall,
      laps: this.laps.map((lap) => ({ ...lap })),
    };
  }
  restore(snapshot: Snapshot, wall = Date.now()) {
    this.running = false;
    this.accumulated =
      snapshot.elapsed +
      (snapshot.running ? Math.max(0, wall - snapshot.savedAt) : 0);
    this.laps = snapshot.laps.map((lap) => ({ ...lap }));
  }
}
export function parseSnapshot(raw: string | null): Snapshot | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      !Number.isFinite(value.elapsed) ||
      value.elapsed < 0 ||
      value.elapsed > 315360000000 ||
      typeof value.running !== "boolean" ||
      !Number.isFinite(value.savedAt) ||
      value.savedAt < 0 ||
      !Array.isArray(value.laps) ||
      value.laps.length > MAX_LAPS
    )
      return null;
    let previous = 0;
    for (const lap of value.laps) {
      if (
        !Number.isFinite(lap.split) ||
        lap.split < previous ||
        lap.split > value.elapsed ||
        typeof lap.label !== "string" ||
        lap.label.length > 80
      )
        return null;
      previous = lap.split;
    }
    return value as Snapshot;
  } catch {
    return null;
  }
}
export function parts(milliseconds: number) {
  const hundredths = Math.floor(Math.max(0, milliseconds) / 10);
  return {
    hours: String(Math.floor(hundredths / 360000)).padStart(2, "0"),
    minutes: String(Math.floor(hundredths / 6000) % 60).padStart(2, "0"),
    seconds: String(Math.floor(hundredths / 100) % 60).padStart(2, "0"),
    fraction: String(hundredths % 100).padStart(2, "0"),
  };
}
export function formatTime(milliseconds: number) {
  const p = parts(milliseconds);
  return `${p.hours}:${p.minutes}:${p.seconds}.${p.fraction}`;
}
export function lapDurations(laps: Lap[]) {
  return laps.map((lap, index) => lap.split - (laps[index - 1]?.split || 0));
}
export function csv(laps: Lap[]) {
  const safe = (label: string) =>
    `"${(/^[\s]*[=+@\-\t\r\n]/.test(label) ? "'" + label : label).replaceAll('"', '""')}"`;
  const durations = lapDurations(laps);
  return (
    "\uFEFFTour,Nom,Durée du tour,Temps cumulé\r\n" +
    laps
      .map(
        (lap, index) =>
          `${index + 1},${safe(lap.label)},${formatTime(durations[index])},${formatTime(lap.split)}`,
      )
      .join("\r\n")
  );
}
