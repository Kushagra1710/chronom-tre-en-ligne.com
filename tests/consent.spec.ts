import { test, expect } from "@playwright/test";

const key = "chrono-analytics-consent-v1";

test("Google is blocked before choice and after refusal across pages", async ({ page }) => {
  const googleRequests: string[] = [];
  page.on("request", request => {
    if (/google-analytics\.com|googletagmanager\.com/.test(request.url())) googleRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("#analytics-consent")).toBeVisible();
  await page.locator("#toggle").click();
  await expect(page.locator("#toggle-label")).toHaveText("Pause");
  await page.locator("#consent-reject").click();
  await page.goto("/minuteur/");
  await expect(page.locator("#analytics-consent")).toBeHidden();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect(googleRequests).toEqual([]);
});

test("acceptance sanitizes URLs, persists, and withdrawal removes cookies and stops loading", async ({ page, context }) => {
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", route => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "application/javascript", body: "" });
  });
  await page.goto("/chronometre-personnalise/?setup=1&title=Private+name#secret", {
    referer: "https://example.org/?email=private@example.org",
  });
  await page.locator("#consent-accept").click();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  const queue = await page.evaluate(() => (window as any).dataLayer.map((entry: any) => Array.from(entry)));
  const config = queue.find((entry: any[]) => entry[0] === "config")[2];
  expect(config.page_location).toBe(new URL("/chronometre-personnalise/", page.url()).href);
  expect(config.page_referrer).toBe("https://example.org/");
  expect(config.allow_google_signals).toBe(false);
  expect(config.cookie_update).toBe(false);
  expect(JSON.stringify(queue)).not.toMatch(/Private|secret|private@example/);
  await page.goto("/minuteur/");
  await expect(page.locator("#analytics-consent")).toBeHidden();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  await context.addCookies([{ name: "_ga", value: "test", url: page.url() }, { name: "_ga_40ZNFZXB6W", value: "test", url: page.url() }]);
  await page.getByRole("button", { name: "Gérer les cookies" }).click();
  await expect(page.locator("#consent-status")).toHaveText("Choix actuel : accepté.");
  await Promise.all([page.waitForEvent("load"), page.locator("#consent-reject").click()]);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect((await context.cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  const count = requests.length;
  await page.goto("/pomodoro/");
  expect(requests.length).toBe(count);
});

test("expired or malformed consent requires a fresh choice", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({ version: 1, accepted: true, savedAt: Date.now() - 181 * 86400000 })), key);
  await page.reload();
  await expect(page.locator("#analytics-consent")).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await page.evaluate(key => localStorage.setItem(key, "invalid"), key);
  await page.reload();
  await expect(page.locator("#analytics-consent")).toBeVisible();
});

test("storage failure never enables tracking implicitly", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error("blocked"); };
  });
  await page.goto("/");
  await page.locator("#consent-reject").click();
  await page.reload();
  await expect(page.locator("#analytics-consent")).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});

test("withdrawal in one tab stops Analytics in another tab", async ({ page, context }) => {
  await context.route("https://www.googletagmanager.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.goto("/");
  await page.locator("#consent-accept").click();
  const other = await context.newPage();
  await other.goto("/minuteur/");
  await expect(other.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Gérer les cookies" }).click();
  await page.locator("#consent-reject").click();
  await expect(other.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await expect(other.locator("#analytics-consent")).toBeHidden();
});
