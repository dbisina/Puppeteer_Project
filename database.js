//database.js
const { Pool } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'scarperdb',
  password: '200107',
  port: 5432,
};

const pool = new Pool(dbConfig);

async function savePost(post) {
  const { text, image, video } = post;
  const existingPost = await pool.query(`
    SELECT * FROM posts 
    WHERE text = $1 AND image = $2 AND video = $3
  `, [text, image, video]);
  if (!existingPost.rows.length) {
    await pool.query(`INSERT INTO posts (text, image, video) VALUES ($1, $2, $3)`, [text, image, video]);
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
