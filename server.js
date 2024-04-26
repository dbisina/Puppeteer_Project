//server.js
const express = require('express');
const cron = require('node-cron');
const scraper = require('./scraper');
const { savePost, getPosts } = require('./database'); // Assuming database.js is in the same directory
const email = require('./email');
const swaggerJson = require('./swagger.json');
const fs = require('fs');
const Axios = require('axios')
const path = require('path');

const app = express();
app.use(express.json());

async function startServer() {
  // Schedule scraping every 12 hours
  //cron.schedule('*/5 * * * *', async () => {
    try {
      const newPosts = await scraper();
      for (const post of newPosts) {
        await savePost(post); // Save post to database

        function generateUniqueFilename(post) {
          // 1. Generate timestamp
          const timestamp = Date.now();
        
          // 2. Sanitize post text (optional)
          const sanitizedText = post.text.replace(/[^\w\-_\.]/g, '-'); // Remove invalid characters
        
          // 3. Truncate sanitized text (optional)
          const truncatedText = sanitizedText.slice(0, 50);
        
          // 4. Combine and return filename with extension
          return `${timestamp}-${truncatedText}.jpg`;
        }
        

        // Download and save image (if present)
        if (post.image) {
          const url = post.image
          
          async function downloadImage(url) {
            const filename = generateUniqueFilename();
            const imagePath = path.join(downloadDir, filename);
          
            // Check if download directory exists
            if (!fs.existsSync(downloadDir)) {
              fs.mkdirSync(downloadDir, { recursive: true }); // Create directory and parent directories if needed
            }
          
            try {
              const response = await Axios({
                url,
                method: 'GET',
                responseType: 'stream'
              });
          
              return new Promise((resolve, reject) => {
                const writeStream = fs.createWriteStream(imagePath);
                response.data.pipe(writeStream)
                  .on('error', reject)
                  .once('close', () => resolve(imagePath));
              });
            } catch (error) {
              console.error(`Error downloading image: ${error}`);
              // Handle download error (e.g., log, retry logic)
              return null; // Indicate download failure
            }
          }
          downloadImage(url)
        }
        
        
        // Send email notification for video posts
        if (post.video) {
          await email(post);
        }
      }
      console.log(`Scraped and saved ${newPosts.length} new posts.`);
    } catch (error) {
      console.error('Error scraping and saving posts:', error);
    }
 // });

  const PORT = process.env.PORT || 3000;

  // Start the server (replace with your desired pclsort)
  app.listen(PORT, () => {
    console.log('Server listening on port 3000');
  });
}


// GET API endpoint for paginated posts
app.get('/api/v1/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await getPosts(page, limit);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});


// Swagger setup
app.get('/api/v1/swagger.json', (req, res) => {
res.json(swaggerJson);
});

// Swagger UI setup
const swaggerUi = require('swagger-ui-express');
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));


startServer();
