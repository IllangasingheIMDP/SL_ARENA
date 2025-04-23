const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken, checkRole } = require('../middleware/auth');


router.get('/stat', authenticateToken,checkRole(['player']), playerController.getPlayerStats);
router.get('/achievements', authenticateToken,checkRole(['player']), playerController.fetchPlayerAchievements);
router.get('/performance', authenticateToken, checkRole(['player']),playerController.fetchPerformanceTrend);
router.get('/reminders', authenticateToken,checkRole(['player']), playerController.fetchTrainingReminders);






module.exports = router;