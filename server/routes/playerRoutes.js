const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken, checkRole } = require('../middleware/auth');


router.get('/stat', authenticateToken,checkRole(['player']), playerController.getPlayerStats);
router.get('/achievements', authenticateToken,checkRole(['player']), playerController.fetchPlayerAchievements);
router.get('/performance', authenticateToken, checkRole(['player']),playerController.fetchPerformanceTrend);
//player profile
router.get('/profiledetails',authenticateToken,checkRole(['player']), playerController.getPlayerProfileDetails);
router.get('/getPlayerMedia', authenticateToken, checkRole(['player']), playerController.getPlayerMedia);
router.put('/updateProfilebio', authenticateToken, checkRole(['player']), playerController.updateProfileBio);






module.exports = router;