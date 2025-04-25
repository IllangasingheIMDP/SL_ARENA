const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.get('/stat', authenticateToken,checkRole(['player']), playerController.getPlayerStats);
router.get('/achievements', authenticateToken,checkRole(['player']), playerController.fetchPlayerAchievements);
router.get('/performance', authenticateToken, checkRole(['player']),playerController.fetchPerformanceTrend);

router.get('/reminders', authenticateToken,checkRole(['player']), playerController.fetchTrainingReminders);

//player profile
router.get('/publicplayers/:player_id', authenticateToken,checkRole(['player','admin','general','organisation']), playerController.getPublicPlayerProfileDetails);
router.get('/allplayers', authenticateToken,checkRole(['player']), playerController.getAllPlayers);
router.get('/profiledetails',authenticateToken,checkRole(['player']), playerController.getPlayerProfileDetails);
router.get('/getPlayerVideos/:userId', authenticateToken, checkRole(['player','admin','general','organisation']), playerController.getPlayerVideos);
router.post('/uploadVideo', authenticateToken, checkRole(['player']), playerController.uploadVideo);
router.post('/uploadVideoForMatch', authenticateToken, checkRole(['player']), playerController.uploadVideoForMatch);
router.delete('/deleteVideo/:videoId', authenticateToken, checkRole(['player','admin']), playerController.deleteVideo);
router.put('/updateProfilebio', authenticateToken, checkRole(['player']), playerController.updateProfileBio);
router.get('/getPlayerPhotos/:userId', authenticateToken, checkRole(['player','admin','general','organisation']), playerController.getPlayerPhotos);
router.post('/uploadPhoto', authenticateToken, checkRole(['player']), upload.single('photo'), playerController.uploadPhoto);
router.post('/uploadPhotoForMatch', authenticateToken, checkRole(['player']), upload.single('photo'), playerController.uploadPhotoForMatch);
router.delete('/deletePhoto/:photoId', authenticateToken, checkRole(['player','admin']), playerController.deletePhoto);
router.get('/getteams', authenticateToken, checkRole(['player']), playerController.getTeamsByLeader);
router.get('/team/:teamId/tournaments', playerController.getTeamTournaments);





module.exports = router;