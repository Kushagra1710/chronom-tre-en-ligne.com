export interface Phase {
  label: string;
  duration: number;
  round: number;
}
export interface TimerSnapshot {
  version: 1;
  phases: Phase[];
  index: number;
  remaining: number;
  deadline: number;
  running: boolean;
  finished: boolean;
}
export class Countdown {
  phases: Phase[];
  index = 0;
  remaining: number;
  deadline = 0;
  running = false;
  finished = false;
  private clock: () => number;
  constructor(phases: Phase[], clock: () => number = () => Date.now()) {
    this.phases = phases.map((phase) => ({ ...phase }));
    this.remaining = phases[0].duration;
    this.clock = clock;
  }
  start() {
    if (this.running || this.finished) return;
    this.deadline = this.clock() + this.remaining;
    this.running = true;
  }
  tick() {
    if (!this.running) return;
    const now = this.clock();
    while (now >= this.deadline) {
      if (this.index >= this.phases.length - 1) {
        this.remaining = 0;
        this.running = false;
        this.finished = true;
        return;
      }
      this.index++;
      this.deadline += this.phases[this.index].duration;
    }
    this.remaining = Math.max(0, this.deadline - now);
  }
  pause() {
    this.tick();
    this.running = false;
  }
  reset() {
    this.index = 0;
    this.remaining = this.phases[0].duration;
    this.running = false;
    this.finished = false;
    this.deadline = 0;
  }
  get phase() {
    return this.phases[this.index];
  }
  get total() {
    return this.phases.reduce((total, phase) => total + phase.duration, 0);
  }
  get progress() {
    return this.finished
      ? 1
      : (this.phases
          .slice(0, this.index)
          .reduce((total, phase) => total + phase.duration, 0) +
          this.phase.duration -
          this.remaining) /
          this.total;
  }
  snapshot(): TimerSnapshot {
    return {
      version: 1,
      phases: this.phases.map((p) => ({ ...p })),
      index: this.index,
      remaining: this.remaining,
      deadline: this.deadline,
      running: this.running,
      finished: this.finished,
    };
  }
  restore(snapshot: TimerSnapshot) {
    this.phases = snapshot.phases.map((phase) => ({ ...phase }));
    this.index = snapshot.index;
    this.remaining = snapshot.remaining;
    this.deadline = snapshot.deadline;
    this.running = snapshot.running;
    this.finished = snapshot.finished;
    this.tick();
    this.running = false;
  }
}
export function parseTimerSnapshot(raw: string | null): TimerSnapshot | null {
  try {
    const value = JSON.parse(raw || "null");
    if (
      !value ||
      value.version !== 1 ||
      !Array.isArray(value.phases) ||
      !value.phases.length ||
      value.phases.length > 200 ||
      !Number.isInteger(value.index) ||
      value.index < 0 ||
      value.index >= value.phases.length ||
      typeof value.running !== "boolean" ||
      typeof value.finished !== "boolean" ||
      !Number.isFinite(value.deadline) ||
      value.deadline < 0 ||
      !Number.isFinite(value.remaining) ||
      value.remaining < 0
    )
      return null;
    for (const phase of value.phases)
      if (
        !phase ||
        typeof phase.label !== "string" ||
        phase.label.length > 40 ||
        !Number.isInteger(phase.duration) ||
        phase.duration < 1000 ||
        phase.duration > 86400000 ||
        !Number.isInteger(phase.round) ||
        phase.round < 1 ||
        phase.round > 100
      )
        return null;
    if (
      value.remaining > value.phases[value.index].duration ||
      (value.finished &&
        (value.running ||
          value.remaining !== 0 ||
          value.index !== value.phases.length - 1)) ||
      (value.running && value.deadline === 0)
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
export function routine(
  work: number,
  rest: number,
  rounds: number,
  longBreak = rest,
  pomodoro = false,
): Phase[] {
  const phases: Phase[] = [];
  for (let round = 1; round <= rounds; round++) {
    phases.push({
      label: pomodoro ? "Concentration" : "Effort",
      duration: work,
      round,
    });
    if (round < rounds && rest > 0)
      phases.push({
        label: pomodoro
          ? round % 4 === 0
            ? "Pause longue"
            : "Pause courte"
          : "Repos",
        duration: pomodoro && round % 4 === 0 ? longBreak : rest,
        round,
      });
  }
  return phases;
}
