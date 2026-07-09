import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Core user-flow end-to-end tests for CrowdFifaX plus automated accessibility scans.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("e2e-init")) {
      window.localStorage.clear();
      sessionStorage.setItem("e2e-init", "1");
    }
    // Default to 'fan' persona for tests unless specified
    window.localStorage.setItem("crowdfifax_persona", "fan");
  });
});

test("landing page loads with its hero heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /From transit to/i }),
  ).toBeVisible();
});

test("landing page links through to the launch and app screen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Launch Dashboard/i }).first().click();
  await expect(page).toHaveURL(/\/launch/);
  
  // Select Fan role to proceed
  await page.getByRole("button", { name: /Fan/ }).click();
  await expect(page.getByRole("button", { name: /Initialize Session/i })).toBeEnabled();
  await page.getByRole("button", { name: /Initialize Session/i }).click();
  await expect(page).toHaveURL(/\/app/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Welcome, Alex/i }),
  ).toBeVisible();
});

test("fan dashboard renders expected VIP welcome details", async ({ page }) => {
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { level: 1, name: /Welcome, Alex/i }),
  ).toBeVisible();
  await expect(page.getByText("Seat 44B • Lower Tier")).toBeVisible();
});

test("wayfinding page loads and accessible routing toggle works", async ({ page }) => {
  await page.goto("/app/wayfinding");
  await expect(
    page.getByRole("heading", { level: 1, name: /Live Wayfinding/i }),
  ).toBeVisible();

  // Initially shows direct route
  await expect(page.getByText(/Route A \(Direct\)/i)).toBeVisible();

  // Toggle wheelchair/accessible routing
  await page.getByTitle(/Wheelchair Accessible Route/i).click();

  // Shows elevator route
  await expect(page.getByText(/Route B \(Elevators Only\)/i)).toBeVisible();
});

test("landing page has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { level: 1 }).waitFor();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("the dashboard has no accessibility violations", async ({ page }) => {
  await page.goto("/app");
  await page.getByRole("heading", { level: 1 }).waitFor();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("the wayfinding page has no accessibility violations", async ({ page }) => {
  await page.goto("/app/wayfinding");
  await page.getByRole("heading", { level: 1 }).waitFor();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
