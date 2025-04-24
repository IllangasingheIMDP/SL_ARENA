const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/createtournament', authenticateToken,checkRole(['organisation']), organizerController.createTournament);
router.get('/ongoingtournaments', authenticateToken,checkRole(['organisation']),organizerController.getTournamentsByOrganizerController);
router.get('/applied-teams',authenticateToken,checkRole(['organisation']), organizerController.getAppliedTeamsToOngoingTournaments);
router.post('/applicants/accept',authenticateToken,checkRole(['organisation']), organizerController.acceptTournamentApplicant);
router.post('/applicants/reject',authenticateToken,checkRole(['organisation']), organizerController.rejectTournamentApplicant);
router.post('/tournaments/teams', authenticateToken,checkRole(['organisation']),organizerController.getAcceptedTeamsByTournament);
router.post('/players-stats_ofTeam', authenticateToken,checkRole(['organisation']),organizerController.getPlayersWithStats);
router.post('/not-applied-teams',authenticateToken,checkRole(['organisation']), organizerController.getTeamsNotApplied);
router.post('/send-invite',authenticateToken,checkRole(['organisation']), organizerController.sendTournamentInvite);
router.post('/addInning',authenticateToken,checkRole(['organisation']), organizerController.addInning);
router.post('/adddelivery',authenticateToken,checkRole(['organisation']), organizerController.addDelivery);
router.post('/current-batsmen-runs',authenticateToken,checkRole(['organisation']), organizerController.getCurrentBatsmenRuns);
router.post('/get-next-ball', authenticateToken,checkRole(['organisation']),organizerController.getNextBallController);
router.post('/updateInningSummary',authenticateToken,checkRole(['organisation']), organizerController.updateInningSummary);
router.post('/updatePlayerStats',authenticateToken,checkRole(['organisation']), organizerController.updatePlayerStats);





module.exports = router;
