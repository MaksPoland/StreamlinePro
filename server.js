require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./')); // Serve static files from the current directory

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err.stack));

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        rating DECIMAL(2,1) NOT NULL,
        review_count INTEGER NOT NULL,
        pros TEXT[] NOT NULL,
        cons TEXT[] NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
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
        product_id INTEGER REFERENCES products(id),
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

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY rating DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
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
    
    // Update product review count and average rating
    await pool.query(
      `UPDATE products 
       SET review_count = review_count + 1,
           rating = (
             SELECT AVG(rating) 
             FROM user_reviews 
             WHERE product_id = $1
           )
       WHERE id = $1`,
      [product_id]
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
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM user_reviews WHERE product_id = $1 ORDER BY created_at DESC',
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve the main page for any routes not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});