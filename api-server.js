require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('./')); 

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err.stack));

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Create contact submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create user reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating database tables:', err);
  }
};

initializeDatabase();

// API Routes
// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Insert into database
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Your message has been submitted successfully!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a product review
app.post('/api/reviews', async (req, res) => {
  try {
    const { product_id, name, rating, comment } = req.body;
    
    // Validate input
    if (!product_id || !name || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Insert into database
    const result = await pool.query(
      'INSERT INTO user_reviews (product_id, name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, name, rating, comment]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Your review has been submitted successfully!',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews for a product
app.get('/api/reviews', async (req, res) => {
  try {
    const productId = req.query.productId;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM user_reviews WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on port ${PORT}`);
});