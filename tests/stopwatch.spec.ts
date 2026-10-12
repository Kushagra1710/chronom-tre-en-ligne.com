import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("start, lap, pause, label, export, reset, and recover", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#toggle")).toBeEnabled();
  await page.locator("#toggle").click();
  await expect(page.locator("#toggle-label")).toHaveText("Pause");
  await page.waitForTimeout(180);
  await page.locator("#lap").click();
  await page.waitForTimeout(120);
  await page.locator("#lap").click();
  await page.locator("#toggle").click();
  await expect(page.locator("#lap-count")).toHaveText("2");
  const stopped = await page.locator("#timer-display").innerText();
  await page.waitForTimeout(150);
  expect(await page.locator("#timer-display").innerText()).toBe(stopped);
  await page
    .getByRole("textbox", { name: "Nom du tour 2", exact: true })
    .fill("Practice");
  const downloaded = page.waitForEvent("download");
  await page.locator("#export").click();
  expect((await downloaded).suggestedFilename()).toMatch(
    /chronometre-en-ligne.*\.csv/,
  );
  await page.reload();
  await expect(page.locator("#recovery")).toBeVisible();
  await page.locator("#restore").click();
  await expect(page.locator("#lap-count")).toHaveText("2");
  await expect(
    page.getByRole("textbox", { name: "Nom du tour 2", exact: true }),
  ).toHaveValue("Practice");
  await expect(page.locator("#toggle-label")).toHaveText("Reprendre");
  await page.locator("#reset").click();
  await page.getByRole("button", { name: "Conserver la séance" }).click();
  await expect(page.locator("#lap-count")).toHaveText("2");
  await page.locator("#reset").click();
  await page.locator("#confirm-reset").click();
  await expect(page.locator("#timer-display")).toHaveText("00:00:00.00");
  await expect(page.locator("#empty-laps")).toBeVisible();
});

test("shortcuts work after clicking Start, but not while typing", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#toggle").click();
  await page.keyboard.press("l");
  await expect(page.locator("#lap-count")).toHaveText("1");
  await page
    .getByRole("textbox", { name: "Nom du tour 1", exact: true })
    .fill("RLLF");
  await expect(page.locator("#lap-count")).toHaveText("1");
  await expect(page.locator("#reset-dialog")).not.toBeVisible();
});

test("theme and settings persist; local data can be cleared", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#settings-open").click();
  await page.locator("#theme-choice").selectOption("dark");
  await page.locator("#show-fractions").uncheck();
  await page.locator("#enable-shortcuts").uncheck();
  await page.getByRole("button", { name: "Fermer les réglages" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("#time-fraction")).not.toBeVisible();
  await page.reload();
  await expect(page.locator("#time-fraction")).not.toBeVisible();
  await page.locator("#settings-open").click();
  await page.locator("#clear-data").click();
  await page.locator("#confirm-reset").click();
  await expect(page.locator("#time-fraction")).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("rs-session-v1")),
  ).toBeNull();
});

test("works without local storage", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/");
  await page.locator("#toggle").click();
  await expect(page.locator("#save-status")).toContainText(
    "Stockage indisponible",
  );
  await page.locator("#lap").click();
  await expect(page.locator("#lap-count")).toHaveText("1");
});

test("fullscreen fallback stays keyboard accessible", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.getElementById("stopwatch")!.requestFullscreen = async () => {
      throw new Error("unsupported");
    };
  });
  await page.locator("#fullscreen").click();
  await expect(page.locator("#stopwatch")).toHaveClass(/focus-mode/);
  await expect(page.locator("#fullscreen-label")).toHaveText(
    "Quitter le plein écran",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#stopwatch")).not.toHaveClass(/focus-mode/);
});

test("accessible light/dark states, responsive layout, and metadata", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://xn--chronomtre-en-ligne-wyb.com/",
  );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  let report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-light.png`,
    fullPage: true,
  });
  await page.locator("#settings-open").click();
  await page.locator("#theme-choice").selectOption("dark");
  report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  await page.getByRole("button", { name: "Fermer les réglages" }).click();
  report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(report.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-dark.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
