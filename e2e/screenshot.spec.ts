import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, "../public/screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

interface ScreenshotPage {
  name: string;
  url: string;
  persona?: "organizer" | "fan" | "volunteer";
}

const pages: ScreenshotPage[] = [
  // Marketing Pages (No persona)
  { name: "home", url: "/" },
  { name: "how-it-works", url: "/how-it-works" },
  { name: "developer", url: "/developer" },
  { name: "launch", url: "/launch" },

  // Organizer Pages
  { name: "organizer_dashboard", url: "/app", persona: "organizer" },
  { name: "organizer_heatmaps", url: "/app/heatmaps", persona: "organizer" },
  { name: "organizer_dispatch", url: "/app/dispatch", persona: "organizer" },
  { name: "organizer_alerts", url: "/app/alerts", persona: "organizer" },
  { name: "organizer_assistant", url: "/app/assistant/operations", persona: "organizer" },
  { name: "organizer_settings", url: "/app/settings", persona: "organizer" },

  // Fan Pages
  { name: "fan_dashboard", url: "/app", persona: "fan" },
  { name: "fan_ticket", url: "/app/ticket", persona: "fan" },
  { name: "fan_wayfinding", url: "/app/wayfinding", persona: "fan" },
  { name: "fan_transit", url: "/app/transit", persona: "fan" },
  { name: "fan_assistant", url: "/app/assistant/fan", persona: "fan" },
  { name: "fan_settings", url: "/app/settings", persona: "fan" },

  // Volunteer Pages
  { name: "volunteer_dashboard", url: "/app", persona: "volunteer" },
  { name: "volunteer_alerts", url: "/app/alerts", persona: "volunteer" },
  { name: "volunteer_assistant", url: "/app/assistant/volunteer", persona: "volunteer" },
  { name: "volunteer_settings", url: "/app/settings", persona: "volunteer" },
];

test.describe("Capture Desktop and Mobile Screenshots for all routes and personas", () => {
  for (const p of pages) {
    test(`screenshot - ${p.name}`, async ({ browser }) => {
      // 1. Desktop Screenshot (1280x800)
      {
        const context = await browser.newContext({
          viewport: { width: 1280, height: 800 },
          deviceScaleFactor: 2, // High quality DPI
        });
        const page = await context.newPage();
        
        // Seed persona in localStorage if specified
        if (p.persona) {
          await page.addInitScript((personaVal) => {
            window.localStorage.setItem("crowdfifax_persona", personaVal);
          }, p.persona);
        } else {
          await page.addInitScript(() => {
            window.localStorage.clear();
          });
        }

        await page.goto(p.url);
        // Wait for page load and any animations
        await page.waitForTimeout(1500);
        
        const screenshotPath = path.join(screenshotsDir, `${p.name}_desktop.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved desktop screenshot for ${p.name} at ${screenshotPath}`);
        await context.close();
      }

      // 2. Mobile Screenshot (390x844 - iPhone 12/13/14 size)
      {
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 3, // Mobile retina DPI
          isMobile: true,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        });
        const page = await context.newPage();

        // Seed persona in localStorage if specified
        if (p.persona) {
          await page.addInitScript((personaVal) => {
            window.localStorage.setItem("crowdfifax_persona", personaVal);
          }, p.persona);
        } else {
          await page.addInitScript(() => {
            window.localStorage.clear();
          });
        }

        await page.goto(p.url);
        // Wait for page load and any animations
        await page.waitForTimeout(1500);

        const screenshotPath = path.join(screenshotsDir, `${p.name}_mobile.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved mobile screenshot for ${p.name} at ${screenshotPath}`);
        await context.close();
      }
    });
  }
});
