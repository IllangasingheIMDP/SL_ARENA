// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const playerRoutes = require('./playerRoutes');

// API version
const API_VERSION = 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use(`${BASE_PATH}/users`, userRoutes);
router.use(`${BASE_PATH}/players`,playerRoutes);

// Handle 404 for API routes
router.all(`${BASE_PATH}/*`, (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

module.exports = router;