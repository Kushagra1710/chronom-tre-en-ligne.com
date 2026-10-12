import { test, expect } from "@playwright/test";
const origin = "https://xn--chronomtre-en-ligne-wyb.com";
const routes = [
  "/",
  "/chronometres/",
  "/chronometre-analogique/",
  "/chronometre-minimaliste/",
  "/chronometre-personnalise/",
  "/minuteur/",
  "/pomodoro/",
  "/minuteur-intervalle/",
  "/minuteurs/",
  "/minuteurs-concentration/",
  "/outils/",
  "/a-propos/",
  "/confidentialite/",
  "/conditions-utilisation/",
  "/contact/",
];

test("all canonical pages are French, linked, and declared in the sitemap", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const route of routes) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      origin + route,
    );
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute(
      "href",
      origin + route,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "fr_FR",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("body").innerText()).not.toMatch(
      /online stopwatch|Show hundredths|Your time/i,
    );
    expect(
      await page.locator("html").evaluate((el) => el.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(sitemap).toContain(`<loc>${origin}${route}</loc>`);
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) =>
        nodes.map(
          (node) =>
            new URL(node.getAttribute("href")!, location.origin).pathname,
        ),
      );
    expect(links.every((path) => routes.includes(path))).toBe(true);
  }
  expect(sitemap.match(/<loc>/g)).toHaveLength(routes.length);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    `Sitemap: ${origin}/sitemap.xml`,
  );
});

test("old English routes redirect permanently and retain shared setups", async ({
  request,
}) => {
  const paths = {
    "analog-stopwatch": "chronometre-analogique",
    "minimal-stopwatch": "chronometre-minimaliste",
    "custom-stopwatch": "chronometre-personnalise",
    "interval-timer": "minuteur-intervalle",
    "focus-timers": "minuteurs-concentration",
    stopwatches: "chronometres",
    timers: "minuteurs",
    timer: "minuteur",
    tools: "outils",
    about: "a-propos",
    privacy: "confidentialite",
    terms: "conditions-utilisation",
  };
  for (const [old, destination] of Object.entries(paths)) {
    for (const suffix of ["", "/"]) {
      const response = await request.get(
        `/${old}${suffix}?setup=1&title=Classe`,
        { maxRedirects: 0 },
      );
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(
        `/${destination}/?setup=1&title=Classe`,
      );
    }
  }
});

test("French structured data matches the visible homepage and contact details", async ({
  page,
}) => {
  await page.goto("/");
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const app = schemas
    .map((value) => JSON.parse(value))
    .find((schema) => schema["@type"] === "WebApplication");
  expect(app).toMatchObject({
    name: "Chronomètre en ligne",
    url: origin + "/",
    inLanguage: "fr",
    offers: { price: "0", priceCurrency: "EUR" },
  });
  const faq = schemas
    .map((value) => JSON.parse(value))
    .find((schema) => schema["@type"] === "FAQPage");
  expect(faq.mainEntity.length).toBe(
    await page.locator(".faq-list details").count(),
  );
  for (const item of faq.mainEntity) {
    expect(await page.locator(".faq-list").textContent()).toContain(item.name);
    expect(await page.locator(".faq-list").textContent()).toContain(
      item.acceptedAnswer.text,
    );
  }
  await page.goto("/contact/");
  await expect(
    page.locator('a[href="mailto:ks487013@gmail.com"]'),
  ).toBeVisible();
});
