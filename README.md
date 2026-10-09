# online stopwatch

A responsive, browser-based stopwatch for **wearlivo.com**, built with Astro, TypeScript, and plain CSS. Fonts are self-hosted, open-source Geist and Geist Mono. No Tailwind setup, backend, or account is needed.

## Develop

Requires Node 22.12+ and npm.

```sh
npm install
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Preview: http://localhost:4321

## Verify

```sh
npm test
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Start the background dev server before running browser tests. Playwright tests cover desktop and an emulated mobile viewport in Chromium; they do not constitute real iOS/Safari testing. Browser screenshots and traces are written to ignored `test-results/`.

## Features

- Start, pause, resume, laps, and confirmed reset.
- Named lap records, cumulative splits, fastest/slowest/average laps, CSV export, and copy.
- Paginated lap records (20 per page, 10,000 per session).
- Native fullscreen with an accessible in-page fallback.
- Light, dark, and system themes; optional hundredths and keyboard shortcuts.
- Browser-local recovery, storage-failure fallback, and optional screen wake lock.
- Original responsive design based on `DESIGN.md`.
- Canonical URLs, metadata, sitemap, robots.txt, About, Privacy, and a custom 404.

## Timing and storage

`src/lib/stopwatch.ts` contains the testable timer model. Active timing uses the browser's monotonic clock, not frame counts. Device sleep can differ across operating systems and browsers. This is an everyday timing tool, not a certified measurement instrument.

Snapshots save approximately every second and on state changes. Recovering a previously running session uses elapsed wall-clock time since the snapshot, then pauses for review. Clock changes can affect recovery. Paused sessions exclude time away. Local storage can be unavailable or cleared; CSV export is the durable user-controlled copy. No cross-device sync is implemented.

Local storage keys: `rs-session-v1`, `rs-settings-v1`, and `rs-theme`. “Clear local data” removes these application records. Already-downloaded files and copied clipboard content are not deleted.

## Deployment

`npm run build` outputs the static site to `dist/`. Configure the host for `https://wearlivo.com`, HTTPS, consistent www redirects, and the generated `404.html`. The sitemap is `/sitemap.xml`.

No production deployment has been performed. Before publishing, review the hosting provider's data handling, inventory any old Wearlivo URLs, and verify the production domain in Search Console. Redirect old URLs only when an equivalent destination exists.

## Additional tools

- `/tools/`: all tools with category buttons and direct page links.
- `/stopwatches/`: digital, analog, minimal, and custom stopwatches.
- `/timers/`: countdown, Pomodoro, and interval timers.
- `/focus-timers/`: focus and work/rest routines.
- `/analog-stopwatch/`: rotating second/minute hands with digital readout and laps.
- `/minimal-stopwatch/`: simpler face with optional lap records.
- `/custom-stopwatch/`: live title, face, color, font, size, background, and lap options; shareable setup links.
- `/timer/`: countdown presets and custom hours/minutes/seconds.
- `/pomodoro/`: automatic focus/short-break/long-break routines.
- `/interval-timer/`: configurable work/rest rounds, including zero-rest routines.

Stopwatch variants use separate local session keys. Timer tools use `rs-timer-{mode}-v1`; custom appearance uses `rs-custom-v1`. Clear local data in stopwatch Settings removes all known tool records. Custom setup URLs include the title and visual settings, never lap history.

Countdowns use wall-clock deadlines, so delayed callbacks catch up without extending phases. Recovery includes time away and pauses for review. Device clock changes affect countdowns. Alarms are short locally generated tones, with mute and test controls; sound is not guaranteed when the device/browser suspends the page.

Cloud accounts and cross-device sync remain outside scope. See `REAL-STOPWATCH-PLAN.md` for the roadmap.
