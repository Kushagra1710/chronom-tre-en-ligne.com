import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("countdown validates input, pauses, and completes", async ({ page }) => {
  await page.clock.install();
  await page.goto("/timer/");
  await page.locator("#duration-minutes").fill("0");
  await page.locator("#duration-seconds").fill("0");
  await page.locator("#countdown-toggle").click();
  await expect(page.locator("#timer-error")).toContainText("at least 1 second");
  await page.locator("#duration-seconds").fill("3");
  await page.locator("#timer-sound").uncheck();
  await page.locator("#countdown-toggle").click();
  await expect(page.locator("#countdown-toggle-label")).toHaveText("Pause");
  await page.clock.runFor(1000);
  await page.locator("#countdown-toggle").click();
  const paused = await page.locator("#countdown-seconds").textContent();
  await page.clock.runFor(5000);
  expect(await page.locator("#countdown-seconds").textContent()).toBe(paused);
  await page.locator("#countdown-toggle").click();
  await page.clock.runFor(3000);
  await expect(page.locator("#countdown-state")).toHaveText("Session complete");
  await expect(page.locator("#countdown-seconds")).toHaveText("00");
  await page.locator("#countdown-reset").click();
  await page.locator("#timer-reset-confirm").click();
  await expect(page.locator("#timer-fields")).toBeEnabled();
});

test("intervals transition through work and rest and restore paused", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/interval-timer/");
  await page.locator("#work-seconds").fill("2");
  await page.locator("#rest-seconds").fill("1");
  await page.locator("#timer-rounds").fill("2");
  await page.locator("#timer-sound").uncheck();
  await page.locator("#countdown-toggle").click();
  await page.clock.runFor(2100);
  await expect(page.locator("#phase-label")).toHaveText("Rest");
  await page.clock.runFor(1000);
  await expect(page.locator("#phase-counter")).toHaveText("ROUND 2 OF 2");
  await page.locator("#countdown-toggle").click();
  await page.reload();
  await expect(page.locator("#timer-recovery")).toBeVisible();
  await page.locator("#timer-restore").click();
  await expect(page.locator("#countdown-toggle-label")).toHaveText("Resume");
  await expect(page.locator("#phase-counter")).toHaveText("ROUND 2 OF 2");
});

test("Pomodoro uses configured focus and break phases", async ({ page }) => {
  await page.clock.install();
  await page.goto("/pomodoro/");
  await page.locator("#focus-minutes").fill("1");
  await page.locator("#break-minutes").fill("1");
  await page.locator("#timer-rounds").fill("2");
  await page.locator("#timer-sound").uncheck();
  await page.locator("#countdown-toggle").click();
  await page.clock.fastForward(61000);
  await expect(page.locator("#phase-label")).toHaveText("Short break");
  await page.clock.fastForward(60000);
  await expect(page.locator("#phase-label")).toHaveText("Focus");
  await expect(page.locator("#phase-counter")).toHaveText("ROUND 2 OF 2");
  await page.clock.fastForward(60000);
  await expect(page.locator("#countdown-state")).toHaveText("Session complete");
});

test("custom stopwatch updates live, persists, and accepts setup links", async ({
  page,
}) => {
  await page.goto("/custom-stopwatch/");
  await page.locator("#custom-title").fill("Morning focus");
  await page.locator("#custom-palette").selectOption("ocean");
  await page.locator("#custom-face").selectOption("analog");
  await page.locator("#custom-laps").uncheck();
  await expect(page.locator(".analog-face")).toBeVisible();
  await expect(page.locator(".session-grid")).toBeHidden();
  await page.locator("#toggle").click();
  await page.locator("#lap").click();
  await page.locator("#custom-title").fill("Evening practice");
  await expect(page.locator("#toggle-label")).toHaveText("Pause");
  await expect(page.locator("#custom-session-title")).toHaveText(
    "Evening practice",
  );
  await page.reload();
  await expect(page.locator("#custom-title")).toHaveValue("Evening practice");
  await expect(page.locator("#stopwatch")).toHaveAttribute(
    "data-palette",
    "ocean",
  );
  await page.goto(
    "/custom-stopwatch/?setup=1&face=analog&palette=plum&title=Shared+setup&laps=false&fractions=false",
  );
  await expect(page.locator("#custom-title")).toHaveValue("Shared setup");
  await expect(page.locator("#stopwatch")).toHaveAttribute(
    "data-palette",
    "plum",
  );
  await expect(page.locator("#time-fraction")).toBeHidden();
});

test("analog and minimal modes preserve separate sessions", async ({
  page,
}) => {
  await page.goto("/analog-stopwatch/");
  await page.locator("#toggle").click();
  await page.locator("#lap").click();
  await expect(page.locator("#second-hand")).not.toHaveAttribute(
    "transform",
    "rotate(0 120 120)",
  );
  await page.goto("/minimal-stopwatch/");
  await expect(page.locator("#recovery")).toBeHidden();
  await expect(page.locator(".session-grid")).toBeHidden();
  await page.locator("#minimal-records").click();
  await expect(page.locator(".session-grid")).toBeVisible();
  await page.goto("/analog-stopwatch/");
  await page.locator("#restore").click();
  await expect(page.locator("#lap-count")).toHaveText("1");
});

for (const route of [
  "/stopwatches/",
  "/timer/",
  "/pomodoro/",
  "/interval-timer/",
  "/custom-stopwatch/",
  "/analog-stopwatch/",
  "/minimal-stopwatch/",
]) {
  test(`new page ${route} has working scripts, metadata, and accessible layout`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      `https://wearlivo.com${route}`,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(report.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (["/timer/", "/custom-stopwatch/", "/stopwatches/"].includes(route))
      await page.screenshot({
        path: `test-results/${info.project.name}-${route.replaceAll("/", "")}.png`,
        fullPage: true,
      });
  });
}

test("clearing local data removes all tool records but keeps unrelated storage", async ({
  page,
}) => {
  await page.goto("/custom-stopwatch/?setup=1&title=Shared");
  await page.evaluate(() => {
    localStorage.setItem("rs-timer-pomodoro-v1", "saved");
    localStorage.setItem("rs-session-analog-v1", "saved");
    localStorage.setItem("unrelated", "keep");
  });
  await page.locator("#settings-open").click();
  await page.locator("#clear-data").click();
  await page.locator("#confirm-reset").click();
  expect(
    await page.evaluate(() => localStorage.getItem("rs-timer-pomodoro-v1")),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem("rs-session-analog-v1")),
  ).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe(
    "keep",
  );
  await expect(page.locator("#custom-title")).toHaveValue("");
  expect(new URL(page.url()).search).toBe("");
});

test("custom colors stay readable in dark mode and mobile directory navigation works", async ({
  page,
}, info) => {
  await page.goto("/custom-stopwatch/");
  await page.locator("#settings-open").click();
  await page.locator("#theme-choice").selectOption("dark");
  await page.getByRole("button", { name: "Close settings" }).click();
  await page.locator("#custom-palette").selectOption("plum");
  await page.locator("#custom-title").fill("A quiet moment");
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  if (info.project.name === "mobile") {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "All tools" })
      .click();
    await expect(page).toHaveURL(/\/tools\/$/);
  }
});
