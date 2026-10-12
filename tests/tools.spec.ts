import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("countdown validates input, pauses, and completes", async ({ page }) => {
  await page.clock.install();
  await page.goto("/minuteur/");
  await page.locator("#duration-minutes").fill("0");
  await page.locator("#duration-seconds").fill("0");
  await page.locator("#countdown-toggle").click();
  await expect(page.locator("#timer-error")).toContainText(
    "au moins 1 seconde",
  );
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
  await expect(page.locator("#countdown-state")).toHaveText("Séance terminée");
  await expect(page.locator("#countdown-seconds")).toHaveText("00");
  await page.locator("#countdown-reset").click();
  await page.locator("#timer-reset-confirm").click();
  await expect(page.locator("#timer-fields")).toBeEnabled();
});

test("intervals transition through work and rest and restore paused", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/minuteur-intervalle/");
  await page.locator("#work-seconds").fill("2");
  await page.locator("#rest-seconds").fill("1");
  await page.locator("#timer-rounds").fill("2");
  await page.locator("#timer-sound").uncheck();
  await page.locator("#countdown-toggle").click();
  await page.clock.runFor(2100);
  await expect(page.locator("#phase-label")).toHaveText("Repos");
  await page.clock.runFor(1000);
  await expect(page.locator("#phase-counter")).toHaveText("CYCLE 2 SUR 2");
  await page.locator("#countdown-toggle").click();
  await page.reload();
  await expect(page.locator("#timer-recovery")).toBeVisible();
  await page.locator("#timer-restore").click();
  await expect(page.locator("#countdown-toggle-label")).toHaveText("Reprendre");
  await expect(page.locator("#phase-counter")).toHaveText("CYCLE 2 SUR 2");
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
  await expect(page.locator("#phase-label")).toHaveText("Pause courte");
  await page.clock.fastForward(60000);
  await expect(page.locator("#phase-label")).toHaveText("Concentration");
  await expect(page.locator("#phase-counter")).toHaveText("CYCLE 2 SUR 2");
  await page.clock.fastForward(60000);
  await expect(page.locator("#countdown-state")).toHaveText("Séance terminée");
});

test("custom stopwatch updates live, persists, and accepts setup links", async ({
  page,
}) => {
  await page.goto("/chronometre-personnalise/");
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
    "/chronometre-personnalise/?setup=1&face=analog&palette=plum&title=Shared+setup&laps=false&fractions=false",
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
  await page.goto("/chronometre-analogique/");
  await page.locator("#toggle").click();
  await page.locator("#lap").click();
  await expect(page.locator("#second-hand")).not.toHaveAttribute(
    "transform",
    "rotate(0 120 120)",
  );
  await page.goto("/chronometre-minimaliste/");
  await expect(page.locator("#recovery")).toBeHidden();
  await expect(page.locator(".session-grid")).toBeHidden();
  await page.locator("#minimal-records").click();
  await expect(page.locator(".session-grid")).toBeVisible();
  await page.goto("/chronometre-analogique/");
  await page.locator("#restore").click();
  await expect(page.locator("#lap-count")).toHaveText("1");
});

for (const route of [
  "/chronometres/",
  "/minuteur/",
  "/pomodoro/",
  "/minuteur-intervalle/",
  "/chronometre-personnalise/",
  "/chronometre-analogique/",
  "/chronometre-minimaliste/",
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
      `https://xn--chronomtre-en-ligne-wyb.com${route}`,
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
    if (
      ["/minuteur/", "/chronometre-personnalise/", "/chronometres/"].includes(
        route,
      )
    )
      await page.screenshot({
        path: `test-results/${info.project.name}-${route.replaceAll("/", "")}.png`,
        fullPage: true,
      });
  });
}

test("clearing local data removes all tool records but keeps unrelated storage", async ({
  page,
}) => {
  await page.goto("/chronometre-personnalise/?setup=1&title=Shared");
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
  await page.goto("/chronometre-personnalise/");
  await page.locator("#settings-open").click();
  await page.locator("#theme-choice").selectOption("dark");
  await page.getByRole("button", { name: "Fermer les réglages" }).click();
  await page.locator("#custom-palette").selectOption("plum");
  await page.locator("#custom-title").fill("A quiet moment");
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  if (info.project.name === "mobile") {
    await page.locator(".tools-dropdown > summary").click();
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Tous les outils" })
      .click();
    await expect(page).toHaveURL(/\/outils\/$/);
  }
});
