import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const blogDir = path.join(root, "src/data/blog");
const routes = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".md"))
  .filter((file) => fs.readFileSync(path.join(blogDir, file), "utf8").includes("<video"))
  .map((file) => file.replace(/-(en|vi)\.md$/, ""))
  .filter((id, index, all) => all.indexOf(id) === index)
  .sort();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const results = [];

for (const id of routes) {
  const url = `http://127.0.0.1:4321/blog/${id}/`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const resultsForRoute = await page
    .locator("article[data-tts-content]")
    .evaluateAll((articles) => articles.map((article) => {
    const pathOf = (value) => {
      if (!value) return "";
      try {
        return new URL(value, window.location.href).pathname;
      } catch {
        return value;
      }
    };
    const videos = Array.from(article.querySelectorAll("video"));
    const cards = Array.from(article.querySelectorAll(".blog-video-card"));
    const firstImage = article.querySelector("img");
    const firstVideo = videos[0];
    const firstCard = firstVideo?.closest(".blog-video-card");
    const duplicatePoster = Boolean(
      firstImage && firstVideo?.poster && pathOf(firstImage.currentSrc || firstImage.src) === pathOf(firstVideo.poster),
    );
        return {
        language: article.closest("[data-blog-language]")?.getAttribute("data-blog-language") || "unknown",
        videoCount: videos.length,
      cardCount: cards.length,
      firstCardIsArticleChild: firstCard?.parentElement === article && article.firstElementChild === firstCard,
      nestedCardCount: cards.filter((card) => card.parentElement?.tagName === "P").length,
      duplicatePoster,
      captions: cards.every((card) => card.querySelectorAll("figcaption").length === 1),
    };
    }));
  results.push(
    ...resultsForRoute.map((result) => ({ id, ...result })),
  );
}

await browser.close();
const failures = results.filter(
  (result) =>
    result.videoCount > 0 &&
    (result.videoCount !== result.cardCount ||
      !result.firstCardIsArticleChild ||
      result.nestedCardCount > 0 ||
      result.duplicatePoster ||
      !result.captions),
);
console.log(JSON.stringify({ routes: results.length, failures, results }, null, 2));
if (failures.length) process.exitCode = 1;
