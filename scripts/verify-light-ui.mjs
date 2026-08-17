import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:4321";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const report = { desktop: {}, mobile: {}, persisted: false, vietnameseFont: "", article: {} };

await desktop.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 60_000 });
const toggle = desktop.locator("button.folio-theme-toggle").first();
await toggle.waitFor({ state: "visible", timeout: 15_000 });
report.desktop.toggleVisible = await toggle.isVisible();
report.desktop.darkBackground = await desktop.evaluate(() => getComputedStyle(document.body).backgroundColor);

await toggle.click();
await desktop.waitForTimeout(300);
report.desktop.lightMode = await desktop.evaluate(() => ({
  uiTheme: document.documentElement.dataset.uiTheme,
  background: getComputedStyle(document.body).backgroundColor,
  headingFont: getComputedStyle(document.querySelector("h1")).fontFamily,
  bodyFont: getComputedStyle(document.body).fontFamily,
}));

await desktop.goto(`${baseUrl}/blog/thu-nghiem-manus-tu-y-tuong-den-ket-qua`, { waitUntil: "networkidle", timeout: 60_000 });
report.persisted = await desktop.evaluate(() => document.documentElement.dataset.uiTheme === "light");
report.vietnameseFont = await desktop.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
report.vietnameseTitle = await desktop.locator("h1").first().innerText();
report.article = await desktop.evaluate(() => {
  const meta = document.querySelector(".blog-meta-panel");
  const article = document.querySelector(".blog-reading-content");
  const search = document.querySelector(".desktop-search-form input");
  const metaStyle = meta ? getComputedStyle(meta) : null;
  const articleStyle = article ? getComputedStyle(article) : null;
  const searchStyle = search ? getComputedStyle(search) : null;
  return {
    metaBackground: metaStyle?.backgroundColor,
    metaColor: metaStyle?.color,
    proseBody: articleStyle?.getPropertyValue("--tw-prose-body").trim(),
    proseHeading: articleStyle?.getPropertyValue("--tw-prose-headings").trim(),
    searchBackground: searchStyle?.backgroundColor,
    searchPlaceholder: search ? getComputedStyle(search, "::placeholder").color : "",
  };
});

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await mobile.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 60_000 });
const mobileToggle = mobile.locator("button.folio-theme-toggle").nth(1);
report.mobile.toggleVisible = await mobileToggle.isVisible();
report.mobile.noHorizontalOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
report.mobile.theme = await mobile.evaluate(() => document.documentElement.dataset.uiTheme);
await mobile.goto(`${baseUrl}/blog/thu-nghiem-manus-tu-y-tuong-den-ket-qua`, { waitUntil: "networkidle", timeout: 60_000 });
report.mobile.articleNoOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
report.mobile.vietnameseContent = await mobile.locator("body").innerText().then((text) => /Đọc bài viết|Viết bởi|Từ một ý tưởng/.test(text));

console.log(JSON.stringify(report, null, 2));
await browser.close();
