const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Using fs/promises for cleaner async/await

async function scrapeCoindesk() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://twitter.com/coindesk');

    // Wait for a minimum number of tweets to load (adjust as needed)
    await page.waitForSelector('[data-testid="cellInnerDiv"]', { timeout: 10000 });

    const posts = await page.$$eval('[data-testid="tweet"]', tweets => {
      return tweets.map(tweet => ({
        text: tweet.querySelector('.[data-testid="tweetText"]').textContent.trim(),
        image: tweet.querySelector('[data-testid="tweetPhoto"]')?.src,
        video: tweet.querySelector('[data-testid="videoComponent"]')?.src,
      }));
    });

    await browser.close();

    return posts;
  } catch (error) {
    console.error('Error scraping Coindesk:', error);
    return [];
  }
}

module.exports = scrapeCoindesk;
