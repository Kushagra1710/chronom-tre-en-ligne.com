import test from "node:test";
import assert from "node:assert/strict";
import {
  Stopwatch,
  parseSnapshot,
  formatTime,
  csv,
  lapDurations,
} from "../src/lib/stopwatch.ts";

test("pause and resume exclude time spent paused", () => {
  let now = 0;
  const watch = new Stopwatch(() => now);
  watch.start();
  now = 1234;
  watch.pause();
  now = 9000;
  assert.equal(watch.elapsed, 1234);
  watch.start();
  now = 10000;
  assert.equal(watch.elapsed, 2234);
});
test("timing derives from a clock without depending on render callbacks", () => {
  let now = 0;
  const watch = new Stopwatch(() => now);
  watch.start();
  now = 3600123;
  assert.equal(watch.elapsed, 3600123);
  assert.equal(formatTime(watch.elapsed), "01:00:00.12");
});
test("laps measure segments and splits without stopping", () => {
  let now = 0;
  const watch = new Stopwatch(() => now);
  assert.equal(watch.lap(), null);
  watch.start();
  now = 1000;
  watch.lap();
  now = 2500;
  watch.lap();
  assert.deepEqual(lapDurations(watch.laps), [1000, 1500]);
  assert.equal(watch.running, true);
  watch.pause();
  assert.equal(watch.lap(), null);
});
test("running recovery includes time away and pauses for review", () => {
  let now = 0;
  const watch = new Stopwatch(() => now);
  watch.start();
  now = 1000;
  watch.lap();
  const saved = watch.snapshot(5000);
  watch.restore(saved, 8000);
  assert.equal(watch.elapsed, 4000);
  assert.equal(watch.running, false);
  watch.laps[0].label = "New";
  assert.equal(saved.laps[0].label, "");
});
test("paused recovery excludes time away and backwards clock recovery adds no negative time", () => {
  const watch = new Stopwatch();
  const base = { version: 1, elapsed: 1200, savedAt: 1000, laps: [] };
  watch.restore({ ...base, running: false }, 10000);
  assert.equal(watch.elapsed, 1200);
  watch.restore({ ...base, running: true }, 500);
  assert.equal(watch.elapsed, 1200);
});
test("reject malformed storage and invalid lap ordering", () => {
  assert.equal(parseSnapshot("{"), null);
  assert.equal(
    parseSnapshot(
      JSON.stringify({
        version: 1,
        elapsed: -1,
        running: true,
        savedAt: 1,
        laps: [],
      }),
    ),
    null,
  );
  assert.equal(
    parseSnapshot(
      JSON.stringify({
        version: 1,
        elapsed: 1000,
        running: false,
        savedAt: 1,
        laps: [{ split: 1001, label: "" }],
      }),
    ),
    null,
  );
  assert.equal(
    parseSnapshot(
      JSON.stringify({
        version: 1,
        elapsed: 1000,
        running: false,
        savedAt: 1,
        laps: [
          { split: 900, label: "" },
          { split: 800, label: "" },
        ],
      }),
    ),
    null,
  );
});
test("CSV quotes labels and neutralizes spreadsheet formulas", () => {
  const output = csv([
    { split: 1000, label: "=SUM(A1)" },
    { split: 2000, label: 'hello, "world"' },
  ]);
  assert.match(output, /"'=SUM\(A1\)"/);
  assert.match(output, /"hello, ""world"""/);
  assert.match(output, /2,.*00:00:01.00,00:00:02.00/);
});
test("reset removes time and laps; formatting handles hour rollover", () => {
  assert.equal(formatTime(3599999), "00:59:59.99");
  assert.equal(formatTime(3600000), "01:00:00.00");
  assert.equal(formatTime(360000000), "100:00:00.00");
  let now = 0;
  const watch = new Stopwatch(() => now);
  watch.start();
  now = 500;
  watch.lap();
  watch.reset();
  assert.equal(watch.elapsed, 0);
  assert.equal(watch.laps.length, 0);
  assert.equal(watch.running, false);
});
