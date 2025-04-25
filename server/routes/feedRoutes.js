const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route GET /api/feed
 * @desc Get feed items with pagination
 * @access Private
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50)
 */
router.get('/getfeed', authenticateToken, feedController.getFeed);

module.exports = router;



