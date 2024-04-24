//scraper.js

const puppeteer = require("puppeteer");

const url = "https://twitter.com/coindesk";

async function scrapeCoindesk() {
  let browser;
  try {
    browser = await puppeteer.launch();
    const [page] = await browser.pages();
    const ua =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
    await page.setUserAgent(ua);
    await page.setRequestInterception(true);
    const blockedResources = ["stylesheet", "font"];
    page.on("request", (req) => {
      if (blockedResources.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const tweetSel = '[data-testid="tweet"]';
    await page.waitForSelector(tweetSel);
    const posts = await scrapeTweets(page, tweetSel);
    return posts;
  } catch (err) {
    console.error("Error scraping Coindesk:", err);
    throw err; // Re-throw for potential handling in server.js
  } finally {
    await browser?.close();
  }
}

async function scrapeTweets(page, tweetSel) {
  const posts = [];
  for (let i = 0; i < 50 && posts.length < 20; i++) {
    const preLen = await page.$$eval(tweetSel, (els) => els.length);
    await page.keyboard.press("PageDown");

    try {
      await page.waitForFunction(
        `document.querySelectorAll('${tweetSel}').length > ${preLen}`,
        { timeout: 2000 }
      );
    } catch (err) {
      // ...
    }

    const chunk = await page.$$eval(tweetSel, (els) =>
      els.map((el) => ({
        text: el.querySelector('[data-testid="tweetText"]').textContent.trim(),
        image: el.querySelector('[data-testid="tweetPhoto"] img')?.getAttribute("src"),
        video: el.querySelector('[data-testid="tweetPhoto"] video')?.getAttribute("src"),
      }))
    );

    for (const e of chunk) {
      if (posts.every((f) => f.text !== e.text)) {
        posts.push(e);
      }
    }
  }
  return posts;
}

module.exports = scrapeCoindesk;
