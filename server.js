//server.js

const express = require('express');
const cron = require('node-cron');
const scraper = require('./scraper');
const db = require('./database');
const email = require('./email');

const app = express();
app.use(express.json());

async function startServer() {
  // Schedule scraping every 12 hours
  cron.schedule('0 */8 * * *', async () => {
    try {
      const newPosts = await scraper();
      for (const post of newPosts) {
        await db.savePost(post); // Save post to database

        // Download and save image (if present)
        if (post.image) {
          const filename = `${Date.now()}-${post.text.replace(/\s+/g, '-').slice(0, 50)}.jpg`; // Generate unique filename
          const imagePath = `./images/${filename}`;
          try {
            const imageResponse = await fetch(post.image);
            const imageBuffer = await imageResponse.arrayBuffer();
            await fs.writeFile(imagePath, imageBuffer);
            console.log(`Image saved: ${imagePath}`);
          } catch (error) {
            console.error('Error downloading image:', error);
          }
        }

        // Send email notification for video posts
        if (post.video) {
          await email.sendVideoPostEmail(post);
        }
      }
      console.log(`Scraped and saved ${newPosts.length} new posts.`);
    } catch (error) {
      console.error('Error scraping and saving posts:', error);
    }
  });

  // Start the server (replace with your desired pclsort)
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

startServer();

// GET API endpoint for paginated posts
app.get('/api/v1/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await db.getPosts(page, limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});


const swaggerJson = require('./swagger.json');

app.get('/api/v1/swagger.json', (req, res) => {
  res.json(swaggerJson);
});

