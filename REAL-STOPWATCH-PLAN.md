# online stopwatch — product, design, and search plan

Domain: https://wearlivo.com
Research date: October 9, 2026
Status: Digital, analog, minimal, and custom stopwatches are implemented, together with countdown, Pomodoro, and interval timers. Classroom and presentation modes remain roadmap items. The user waived the Tailwind skill; this release uses plain CSS and free, self-hosted Geist fonts. The original planning prerequisite below is retained as historical context and no longer blocks this release.

## Direction

Build a calm, immediately usable stopwatch with strong lap analysis and session recovery. Lead with the working tool. Students, independent workers, and people timing repeated activities are the initial audience. Classroom and presentation modes are the next expansion.

Proposed promise: **A clear stopwatch. Every session in view.**

Use `online stopwatch` consistently in the wordmark and site identity; use Wearlivo as the domain. No account required for core timing. Recommend an ad-free timing surface at launch; monetization can be reconsidered after evidence of repeat use.

## Evidence and limits

| Competitor | Observed features | Product opportunity |
| --- | --- | --- |
| [Flocus aesthetic stopwatch](https://flocus.com/aesthetic-stopwatch/) | Indexed page includes Start, Lap, current/total time, focus and break controls, and named themes. | Combine a calm appearance with practical lap comparison, export, and recovery. |
| [Online-Stopwatch](https://www.online-stopwatch.com/) | Stopwatch/countdown, fullscreen, split laps, classroom/exam/presentation tools, interval timers, language options, and an ad-free premium offer. | Make common timing tasks easy to discover within a small, consistent product. |

These are feature-inventory findings, not measured usability or performance comparisons. Flocus's direct page fetch exposed no readable content; its indexed page supplied the findings above. No competitor interactions, accuracy, persistence, or mobile behavior were tested. An unobserved feature is not evidence that a competitor lacks it. Competitive advantages below are proposals to validate.

## Launch scope

### First release: excellent stopwatch

- Start, pause, resume, lap, and reset. Clear idle, running, paused, and restored states.
- Hours/minutes/seconds with optional fractional seconds; stable digit widths.
- Lap table: lap number, lap duration, cumulative split, optional label, fastest/slowest completed lap, and average. Never mix an unfinished lap into completed-lap statistics.
- Copy results and export CSV. Escape labels safely for spreadsheet use.
- Fullscreen with visible exit control; an in-page focus view when fullscreen is unavailable.
- Light, dark, and system appearance. Optional subtle gradient theme later, with readable digits in every theme.
- Keyboard operation, visible shortcut help, and a way to disable character shortcuts. Ignore shortcuts while typing and prevent repeated keydown from toggling repeatedly.
- Recover an interrupted session after refresh. Offer explicit resume/discard choices and distinguish paused from running sessions.
- Local storage with clear/delete controls; graceful operation if persistence is blocked. State clearly that local history does not sync between devices.
- Reset confirmation or undo that protects existing laps.
- Useful browser-tab title, updated conservatively.
- Optional keep-screen-awake when supported, with visible status and graceful fallback.

### Second release: adjacent timing needs

- Countdown timer with editable duration, presets, sound preview, mute, and explicit alarm limitations when a browser/device is suspended.
- Pomodoro with configurable work/break cycles and clear progress.
- Named local session history and basic summaries; opt-in offline support with tested cache updates.
- Shareable configuration links that do not automatically expose private session labels or history.

### Third release: distinct use cases

- Interval timer: work/rest/repeat sequences.
- Classroom display: large digits, simple controls, optional silent visual completion cue.
- Presentation timer: checkpoints and optional overtime display.
- A lightweight embeddable tool with documented integration.

Defer accounts, cloud sync, subscriptions, music/video libraries, unrelated randomizers, and large theme galleries until usage justifies their cost.

## Homepage and visual design

Follow [DESIGN.md](./DESIGN.md): near-white `#fafafa`, white panels, ink `#171717`, body text `#4d4d4d`, hairlines `#ebebeb`, Geist typography, restrained depth, and 6px functional controls. Preserve its Vercel-inspired restraint while creating an original stopwatch layout and wordmark.

Adapt the design reference to a utility: compact introduction instead of a tall marketing hero. The timer and Start button should be visible without scrolling on common mobile screens.

Page order:

1. Compact header: wordmark, available timing tools, theme switch.
2. H1: “Online Stopwatch”; one short sentence explaining the tool.
3. Large timing display, status, Start/Pause, Lap, Reset.
4. Fullscreen and settings actions; keyboard hints on suitable screens.
5. Lap table and export actions; concise empty-state instructions.
6. Brief usage instructions, timing/recovery explanation, focused FAQs.
7. Related working tools, then About, Contact, Privacy, and Terms.

Do not display links to unfinished tools. Keep the same timer mounted when entering focus mode. On mobile, prioritize reachable controls and legible lap records; secondary settings belong in an accessible panel.

Use proportional Geist for headings and body. The timer may use Geist Mono/tabular numbers as an intentional functional extension to DESIGN.md. Keep any mesh gradient outside the digit surface and subtle enough to preserve contrast. Do not copy Vercel logos or competitor layouts. Create dark-mode tokens explicitly; DESIGN.md primarily specifies light mode.

Accessible interaction requirements informed by [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): semantic buttons and tables, named icon controls, visible focus, keyboard-accessible dialogs, reduced motion, and stable layout. Target 44px touch controls and WCAG AA text contrast. DESIGN.md's muted gray values need contrast checks before use as small text. Announce start/pause/lap events, never every changing timer digit. Preserve browser zoom and test at 200% zoom.

The unrelated text embedded in DESIGN.md's `label-sm.fontWeight` value should not become a CSS token; use the intended numeric weight 500.

## Astro implementation approach

The workspace currently has the Astro starter page, Astro `^7.3.5` in package.json, and no Tailwind dependency. There are substantial existing working-tree changes from an earlier project; preserve them.

Use static Astro pages for the shell, tool descriptions, and help. Use a small TypeScript timing module and Astro client scripts for interactions. A UI framework and backend are unnecessary for the first release. Astro officially supports client event handlers without a framework: [scripts guide](https://docs.astro.build/en/guides/client-side-scripts/).

Suggested boundaries:

- `src/layouts/ToolLayout.astro`: page metadata, shared header/footer, styles.
- `src/components/stopwatch/`: display, controls, lap table, settings.
- `src/lib/timing/`: state transitions and timing calculations independent of DOM.
- `src/lib/storage/`: versioned local persistence and recovery.
- `src/pages/`: homepage, later dedicated tools, supporting information.

Timing acceptance requirements: elapsed time must derive from timestamps rather than counting render ticks; pause/resume must not add paused time; hidden-tab repaint throttling must not lose elapsed time. Define and test sleep, reload, and system-clock-change behavior separately. Display precision must not be marketed as guaranteed measurement accuracy. Never promise reliable background alarms when a device is asleep.

Tailwind v4 is the requested styling system. Its local skill documentation is uninitialized. Detailed Tailwind configuration is pending the required documentation-license acceptance and synchronization; no Tailwind configuration is prescribed here.

Use the requested `astro dev --background` workflow for previews and `astro dev status`, `logs`, and `stop` to manage it.

## Search plan

Search visibility is an outcome to measure, not a launch guarantee. Google explicitly states that no technique automatically ranks a site first: [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Proposed search targets are hypotheses, not measured keyword-volume or difficulty findings:

| Phase / route | Primary intent | Distinct value |
| --- | --- | --- |
| Launch `/` | online stopwatch; stopwatch with laps | Complete stopwatch, lap analysis, export, recovery |
| Next `/timer/` | online countdown timer | Duration presets and completion controls |
| Next `/pomodoro/` | Pomodoro timer | Configurable focus/break workflow |
| Later `/interval-timer/` | online interval timer | Repeatable work/rest sequences |
| Later `/classroom-timer/` | classroom timer | Projector-friendly presentation and silent cues |

Keep fullscreen and aesthetic choices as homepage modes initially. Avoid competing `/stopwatch/`, `/online-stopwatch/`, and `/fullscreen-stopwatch/` pages with substantially identical content. Index a specialized page only when it delivers distinct functionality and useful supporting content. Duration presets can remain configuration URLs until there is a reason for a dedicated page.

Suggested homepage title: `Online Stopwatch with Laps & Fullscreen | Online Stopwatch`.

Suggested description, only after these features work: `Start a free online stopwatch with lap times, fullscreen mode, CSV export, and session recovery. Simple timing for study, work, and everyday tasks.`

Technical delivery: canonical HTTPS origin `https://wearlivo.com`; consistent www/slash redirects; unique titles and descriptions; crawlable internal links; sitemap and robots.txt; meaningful HTML; real 404s; social preview metadata. Astro's [sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) supports the configured site origin. Keep configuration variants out of the sitemap and consolidate duplicate views appropriately.

Write concise original help beside each tool. Explain lap versus split time with a worked example and document actual recovery behavior. The useful interactive tool is itself main content; Google includes functional tools in its [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Avoid filler written to meet an arbitrary word count, invented reviews, or unsupported claims of precision. Structured data must describe real visible content and does not guarantee a rich result.

Launch with accurate About, Contact, Privacy, and Terms pages. Inventory previously published Wearlivo URLs before deployment because the working tree indicates an older fashion project. Redirect only genuinely equivalent resources; do not send unrelated deleted articles to the stopwatch homepage.

Build awareness through useful teacher resources, timing guides, and a later embed. Outreach is a proposed activity, not authorized messaging. Validate search demand with Search Console after launch and external keyword data when available.

## Delivery gates and measurement

1. Build the stopwatch and original responsive design, then validate state transitions, recovery, lap math, exports, and keyboard behavior.
2. Test Chromium, Firefox, Safari, iOS Safari, and Android Chrome: small screens, zoom, storage denied, background tabs, refresh, sleep/resume, fullscreen fallback, and long sessions. Include reduced motion and screen-reader review.
3. Audit implemented UI using web-design-guidelines; run production build and check metadata, links, indexability, and canonical URLs.
4. Optimize and deploy only when the core tool is reliable; connect Search Console and inspect submitted URLs.
5. Review at roughly 30/60/90 days: indexed pages, nonbrand impressions/clicks by query and page, field performance, successful starts/laps/exports, and return usage where measurable without collecting private session content.

Performance targets at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. These are targets, not measured results. Use lab checks before launch and field data afterward. See [Google's Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).

Prioritize fixes using observed failures and query demand. Add the next tool after the first tool is dependable, then expand only where real user needs and search evidence support it.

## Remaining prerequisite

The requested [tailwind-4-docs skill](./.agents/skills/tailwind-4-docs/SKILL.md) says: “the user must accept its license before downloading” and “Do not proceed with Tailwind guidance until the snapshot is initialized or refreshed.” The snapshot is absent. Before Tailwind implementation, obtain acceptance of the upstream documentation license and permission to run:

```sh
python3 .agents/skills/tailwind-4-docs/scripts/sync_tailwind_docs.py --accept-docs-license
```

License: https://github.com/tailwindlabs/tailwindcss.com#license
