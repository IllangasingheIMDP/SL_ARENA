// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, checkRole } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../middleware/validation');

// Public routes
router.post('/register', userController.register);
router.post('/login', validateLogin, userController.login);
router.post('/choose-role', userController.chooseRole);

// Protected routes (require authentication)
router.get('/players-leaderboard/:role',authenticateToken, userController.getLeaderboard);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changePassword);

// Admin only routes
router.put('/role', authenticateToken, checkRole(['admin']), userController.updateRole);
router.put('/verification', authenticateToken, checkRole(['admin']), userController.updateVerificationStatus);

module.exports = router;
