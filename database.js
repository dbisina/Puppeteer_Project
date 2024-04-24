//database.js
const { Pool } = require('pg');

const dbConfig = {
  user: 'postgres', // Replace with your database username
  host: 'localhost', // Replace with your database host
  database: 'scarperdb', // Replace with your database name
  password: '200107', // Replace with your database password
  port: 5432,
};

const pool = new Pool(dbConfig);

async function savePost(post) {
  const { text, image, video } = post;
  const existingPost = await db.query(`SELECT * FROM posts WHERE id = $1`, [text]);
  if (!existingPost.rows.length) {
      await db.query(`INSERT INTO posts (id, text, image, video) VALUES ($1, $2, $3, $4)`, [text, image, video]);
    }
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error('Error saving post to database:', error);
  }
}

async function getPosts(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const query = `SELECT * FROM posts ORDER BY id DESC OFFSET $1 LIMIT $2`;
  const values = [offset, limit];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching posts from database:', error);
    return [];
  }
}

module.exports = { savePost, getPosts };
