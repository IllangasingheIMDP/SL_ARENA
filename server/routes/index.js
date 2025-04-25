// routes/index.js
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const organizerRoutes = require('./organizerRoutes');
const notificationRoutes = require('./notificationRoutes');
const placeRoutes = require('./placeRoutes');
const teamRoutes = require('./teamRoutes');
const feedRoutes = require('./feedRoutes');
// API version
const API_VERSION = 'v1';
const BASE_PATH = `/api/${API_VERSION}`;

module.exports = (io) => {
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
  router.use(`${BASE_PATH}/players`, require('./playerRoutes'));
  router.use(`${BASE_PATH}/organizers`, organizerRoutes);
  router.use(`${BASE_PATH}/notifications`, notificationRoutes(io));
  router.use(`${BASE_PATH}/places`, placeRoutes);
  router.use(`${BASE_PATH}/teams`, teamRoutes);
  router.use(`${BASE_PATH}/feed`, feedRoutes);
  
  // Handle 404 for API routes
  router.all(`${BASE_PATH}/*`, (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'API endpoint not found'
    });
  });

  return router;
};