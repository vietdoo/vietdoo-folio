import { chromium } from "playwright";

const baseUrl = process.env.SEARCH_SMOKE_URL || "http://127.0.0.1:4321/blog";
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });

  const trigger = page.locator(".mobile-search-trigger");
  const panel = page.locator(".mobile-search-panel");
  const input = page.locator(".mobile-search-input");
  const close = page.locator(".mobile-search-close");

  await trigger.waitFor({ state: "visible", timeout: 10_000 });
  if (await page.locator(".desktop-search-form").isVisible()) {
    throw new Error("Desktop search input is visible at mobile viewport");
  }

  await trigger.click();
  await panel.waitFor({ state: "visible", timeout: 5_000 });
  await input.waitFor({ state: "visible", timeout: 5_000 });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: ".artifacts/ui-review/search-mobile-mobile/panel-open.png",
    fullPage: false,
  });
  if (
    !(await input.evaluate((element) => element === document.activeElement))
  ) {
    throw new Error("Mobile search input did not receive focus after opening");
  }

  await input.fill("agent");
  await page.waitForFunction(
    () => window.location.search.includes("q=agent"),
    null,
    { timeout: 5_000 },
  );
  const currentUrl = page.url();
  if (!currentUrl.includes("?q=agent") && !currentUrl.includes("&q=agent")) {
    throw new Error("Search query was not synchronized to the URL");
  }

  await page.getByRole("button", { name: "Clear search" }).click();
  if ((await input.inputValue()) !== "") {
    throw new Error("Clear search did not empty the input");
  }

  await close.click();
  await panel.waitFor({ state: "hidden", timeout: 5_000 });
  console.log(`Mobile search smoke passed: ${baseUrl}`);
} finally {
  await browser.close();
}
