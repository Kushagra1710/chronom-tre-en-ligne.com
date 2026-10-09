import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("browse from one directory to category pages and working tools", async ({
  page,
}) => {
  await page.goto("/tools/");
  const links = await page
    .locator("main a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(new Set(links).size).toBe(links.length);
  await page
    .getByRole("navigation", { name: "Tool categories" })
    .getByRole("link", { name: /^Stopwatches/ })
    .click();
  await expect(page).toHaveURL(/\/stopwatches\/$/);
  await expect(page.locator(".tool-link-card")).toHaveCount(4);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "All tools" })
    .click();
  await page
    .getByRole("navigation", { name: "Tool categories" })
    .getByRole("link", { name: /^Timers/ })
    .click();
  await expect(page).toHaveURL(/\/timers\/$/);
  await page
    .locator(".tool-link-card")
    .filter({ hasText: "Countdown timer" })
    .click();
  await expect(page.locator("#countdown-toggle")).toBeEnabled();
  await expect(page.locator("#tool-menu")).toHaveCount(0);
});

test("pages have one relevant tool listing with accessible mobile navigation", async ({
  page,
}, info) => {
  for (const route of ["/", "/tools/", "/timer/", "/custom-stopwatch/"]) {
    await page.goto(route);
    await expect(page.locator("#tool-menu")).toHaveCount(
      route === "/tools/" ? 1 : 0,
    );
    await expect(page.locator(".tool-card-grid")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(report.violations).toEqual([]);
  }
  await page.goto("/tools/");
  await page.screenshot({
    path: `test-results/${info.project.name}-simplified-tools.png`,
    fullPage: true,
  });
});
