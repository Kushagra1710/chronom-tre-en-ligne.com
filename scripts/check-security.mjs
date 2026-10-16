import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, extname } from "node:path";
import { chromium } from "@playwright/test";

// Exercise the actual production files with their response CSP before upload.
// Fulfill requests in Playwright so this needs no local HTTP server and never
// sends synthetic page views to the real Analytics property.
const root = fileURLToPath(new URL("../dist/client/", import.meta.url));
const headerFile = await readFile(join(root, "_headers"), "utf8");
const globalBlock = headerFile.split(/^\/\*$/m)[1];
assert.ok(globalBlock, "Global security headers are missing");
const headers = Object.fromEntries([...globalBlock.matchAll(/^  ([^:]+): (.+)$/gm)]
  .map(([, name, value]) => [name.toLowerCase(), value]));
assert.equal(headers["x-content-type-options"], "nosniff");
assert.ok(!headers["content-security-policy"].match(/script-src[^;]*'unsafe-(inline|eval)'/));
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    const violations = [];
    let googleLoads = 0;
    let measurementCalls = 0;
    page.on("pageerror", error => errors.push(error.message));
    await page.exposeFunction("reportCSPViolation", value => violations.push(value));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", event => {
      window.reportCSPViolation(`${event.effectiveDirective}: ${event.blockedURI}`);
    }));
    await context.route("https://security-check.invalid/**", async route => {
      const path = decodeURIComponent(new URL(route.request().url()).pathname);
      let file = join(root, path);
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      await route.fulfill({ status: 200, headers: { ...headers, "content-type": types[extname(file)] || "application/octet-stream" }, body: await readFile(file) });
    });
    await context.route("https://www.googletagmanager.com/**", route => {
      googleLoads++;
      return route.fulfill({ contentType: "application/javascript", body: 'fetch("https://www.google-analytics.com/g/collect?test=1")' });
    });
    await context.route("https://www.google-analytics.com/**", route => {
      measurementCalls++;
      return route.fulfill({ status: 204 });
    });
    for (const path of paths) {
      await page.goto("https://security-check.invalid" + path);
      assert.equal(await page.locator("html").getAttribute("lang"), "fr");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, path);
    }
    assert.equal(googleLoads, 0, "Google loaded without consent");
    await page.goto("https://security-check.invalid/");
    const measurement = page.waitForResponse("https://www.google-analytics.com/g/collect?test=1");
    await page.locator("#consent-accept").click();
    await page.waitForFunction(() => document.querySelector('script[src*="googletagmanager"]'));
    await measurement;
    assert.equal(googleLoads, 1);
    assert.equal(measurementCalls, 1, "CSP blocked accepted measurement");
    await page.locator("#toggle").click();
    await page.locator("#lap").click();
    await page.locator("#toggle").click();
    assert.equal(await page.locator("#lap-count").textContent(), "1");
    const download = page.waitForEvent("download");
    await page.locator("#export").click();
    assert.match((await download).suggestedFilename(), /\.csv$/);
    // An unapproved inline script must be blocked, while the app remains usable.
    await page.evaluate(() => {
      const script = document.createElement("script");
      script.textContent = "window.unapprovedScriptRan = true";
      document.head.append(script);
    });
    assert.equal(await page.evaluate(() => window.unapprovedScriptRan), undefined);
    await page.waitForTimeout(100);
    assert.deepEqual(violations.filter(value => !value.startsWith("script-src-elem: inline")), []);
    assert.ok(violations.some(value => value === "script-src-elem: inline"));
    assert.deepEqual(errors, []);
    console.log(`${width}px: ${paths.length} French pages, consent, stopwatch, export and CSP checks passed`);
    await context.close();
  }
} finally { await browser.close(); }
