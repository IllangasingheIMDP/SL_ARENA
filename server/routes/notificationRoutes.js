/* routes/notificationRoutes.js */
const express = require('express');
const router = express.Router();
const { 
  createNotification, 
  createBulkNotification,
  getNotifications, 
  markNotificationAsRead 
} = require('../controllers/notificationController');
const {authenticateToken,checkRole} = require('../middleware/auth'); // Your JWT middleware

module.exports = (io) => {
  router.post('/', authenticateToken, checkRole(['organizer','admin','general','player','trainer']), (req, res) => createNotification(io)(req, res));
  router.post('/bulk', authenticateToken, checkRole(['organizer','admin','general','player','trainer']), (req, res) => createBulkNotification(io)(req, res));
  router.get('/', authenticateToken, checkRole(['organizer','admin','general','player','trainer']), getNotifications);
  router.put('/:notification_id/read', authenticateToken, checkRole(['organizer','admin','general','player','trainer']),(req,res) => markNotificationAsRead(io)(req,res));
  return router;
};