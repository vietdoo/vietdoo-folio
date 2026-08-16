const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();
  const url = 'https://vietdoo.vndo.vn/blog';

  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForLoadState('networkidle');

  // Wait a bit and scroll down
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);

  // Select a random blog post links
  const links = await page.$$('a[href^="/blog/"]');
  if (links.length > 0) {
     const randomIndex = Math.floor(Math.random() * links.length);
     const randomLink = links[randomIndex];
     console.log('Clicking on a random post...');
     await randomLink.click();

     await page.waitForLoadState('networkidle');
     await page.waitForTimeout(2000);

     // Scroll through the post slowly
     for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(2000);
     }
  } else {
     console.log('No blog posts found on the main page.');
  }

  await context.close();
  await browser.close();

  console.log('Video recording finished.');
})();
