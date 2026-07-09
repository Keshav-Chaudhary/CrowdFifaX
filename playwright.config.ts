import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config. Boots the production build and runs end-to-end plus
 * accessibility (axe) checks against it. CI-friendly: retries on CI, single
 * worker, and starts the app automatically.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
