import test from "node:test";
import assert from "node:assert/strict";
import {
  Countdown,
  routine,
  parseTimerSnapshot,
} from "../src/lib/countdown.ts";
import { parseCustomization } from "../src/lib/customization.ts";

test("countdown reaches zero and never becomes negative", () => {
  let now = 0;
  const timer = new Countdown(
    [{ label: "Countdown", duration: 2000, round: 1 }],
    () => now,
  );
  timer.start();
  now = 500;
  timer.tick();
  assert.equal(timer.remaining, 1500);
  now = 7000;
  timer.tick();
  assert.equal(timer.remaining, 0);
  assert.equal(timer.finished, true);
  assert.equal(timer.running, false);
});
test("pause/resume preserves remaining duration", () => {
  let now = 0;
  const timer = new Countdown(routine(2000, 1000, 2), () => now);
  timer.start();
  now = 500;
  timer.pause();
  now = 20000;
  timer.tick();
  assert.equal(timer.remaining, 1500);
  timer.start();
  now = 21000;
  timer.tick();
  assert.equal(timer.remaining, 500);
});
test("late callback catches up across phases without stretching them", () => {
  let now = 0;
  const timer = new Countdown(routine(2000, 1000, 3), () => now);
  timer.start();
  now = 6500;
  timer.tick();
  assert.equal(timer.index, 4);
  assert.equal(timer.remaining, 1500);
  assert.equal(timer.phase.round, 3);
  now = 8000;
  timer.tick();
  assert.equal(timer.finished, true);
  assert.equal(timer.progress, 1);
});
test("Pomodoro has long breaks every fourth session, but no final break", () => {
  const phases = routine(25000, 5000, 5, 15000, true);
  assert.equal(phases.length, 9);
  assert.equal(phases[7].label, "Long break");
  assert.equal(phases[7].duration, 15000);
  assert.equal(phases.at(-1).label, "Focus");
  assert.equal(routine(2000, 0, 4).length, 4);
});
test("running restoration includes time away and pauses for review", () => {
  let now = 1000;
  const timer = new Countdown(routine(2000, 1000, 2), () => now);
  timer.start();
  const saved = timer.snapshot();
  now = 4500;
  timer.restore(saved);
  assert.equal(timer.index, 2);
  assert.equal(timer.remaining, 1500);
  assert.equal(timer.running, false);
});
test("finished recovery, reset, and invalid snapshots", () => {
  let now = 0;
  const timer = new Countdown(routine(1000, 0, 1), () => now);
  timer.start();
  const snapshot = timer.snapshot();
  now = 3000;
  timer.restore(snapshot);
  assert.equal(timer.finished, true);
  timer.reset();
  assert.equal(timer.remaining, 1000);
  assert.equal(timer.progress, 0);
  assert.ok(parseTimerSnapshot(JSON.stringify(timer.snapshot())));
  assert.equal(
    parseTimerSnapshot(JSON.stringify({ ...timer.snapshot(), remaining: -5 })),
    null,
  );
  assert.equal(
    parseTimerSnapshot(JSON.stringify({ ...timer.snapshot(), index: 9 })),
    null,
  );
  assert.equal(parseTimerSnapshot("{"), null);
});
test("customization ignores unknown styles and bounds session titles", () => {
  const config = parseCustomization({
    face: "invalid",
    palette: "url(evil)",
    size: "large",
    title: "x".repeat(100),
    laps: false,
  });
  assert.equal(config.face, "digital");
  assert.equal(config.palette, "ink");
  assert.equal(config.title.length, 60);
  assert.equal(config.laps, false);
  assert.equal(config.size, "large");
});

test("saving never consumes a phase transition before the UI can announce it", () => {
  let now = 0;
  const timer = new Countdown(routine(1000, 1000, 2), () => now);
  timer.start();
  now = 1200;
  timer.snapshot();
  assert.equal(timer.index, 0);
  timer.tick();
  assert.equal(timer.index, 1);
});
