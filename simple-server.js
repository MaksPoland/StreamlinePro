const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./')); // Serve static files from the current directory

// A test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
});