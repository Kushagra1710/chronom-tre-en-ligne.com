import { defineConfig, devices } from "@playwright/test";
// This config runs in Node; keep the optional port override locally typed.
declare const process: { env: { PLAYWRIGHT_BASE_URL?: string } };

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321", trace: "retain-on-failure" },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  reporter: "list",
});
