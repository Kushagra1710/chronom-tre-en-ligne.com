import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("browse from one directory to category pages and working tools", async ({
  page,
}) => {
  await page.goto("/outils/");
  const links = await page
    .locator("#tool-menu a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(new Set(links).size).toBe(links.length);
  await page
    .getByRole("navigation", { name: "Catégories d’outils" })
    .getByRole("link", { name: /^Chronomètres/ })
    .click();
  await expect(page).toHaveURL(/\/chronometres\/$/);
  await expect(page.locator(".tool-link-card")).toHaveCount(4);
  await page.locator(".tools-dropdown > summary").click();
  await page
    .getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: "Tous les outils" })
    .click();
  await page
    .getByRole("navigation", { name: "Catégories d’outils" })
    .getByRole("link", { name: /^Minuteurs/ })
    .click();
  await expect(page).toHaveURL(/\/minuteurs\/$/);
  await page
    .locator(".tool-link-card")
    .filter({ hasText: "Minuteur en ligne" })
    .click();
  await expect(page.locator("#countdown-toggle")).toBeEnabled();
  await expect(page.locator("#tool-menu")).toHaveCount(0);
});

test("pages have one relevant tool listing with accessible mobile navigation", async ({
  page,
}, info) => {
  for (const route of [
    "/",
    "/outils/",
    "/minuteur/",
    "/chronometre-personnalise/",
  ]) {
    await page.goto(route);
    await expect(page.locator("#tool-menu")).toHaveCount(
      route === "/outils/" ? 1 : 0,
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
  await page.goto("/outils/");
  await page.screenshot({
    path: `test-results/${info.project.name}-simplified-tools.png`,
    fullPage: true,
  });
});
