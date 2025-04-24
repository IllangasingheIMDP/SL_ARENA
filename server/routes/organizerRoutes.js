const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/createtournament', authenticateToken,checkRole(['organizer']), organizerController.createTournament);
router.get('/ongoingtournaments', authenticateToken,checkRole(['organizer']),organizerController.getTournamentsByOrganizer);
router.get('/applied-teams',authenticateToken,checkRole(['organizer']), organizerController.getAppliedTeamsToOngoingTournaments);
router.post('/applicants/accept',authenticateToken,checkRole(['organizer']), organizerController.acceptTournamentApplicant);
router.post('/applicants/reject',authenticateToken,checkRole(['organizer']), organizerController.rejectTournamentApplicant);
router.post('/tournaments/teams', authenticateToken,checkRole(['organizer']),organizerController.getAcceptedTeamsByTournament);
router.post('/players-stats_ofTeam', authenticateToken,checkRole(['organizer']),organizerController.getPlayersWithStats);
router.post('/not-applied-teams',authenticateToken,checkRole(['organizer']), organizerController.getTeamsNotApplied);
router.post('/send-invite',authenticateToken,checkRole(['organizer']), organizerController.sendTournamentInvite);
router.post('/addInning',authenticateToken,checkRole(['organizer']), organizerController.addInning);
router.post('/adddelivery',authenticateToken,checkRole(['organizer']), organizerController.addDelivery);
router.post('/current-batsmen-runs',authenticateToken,checkRole(['organizer']), organizerController.getCurrentBatsmenRuns);
router.post('/get-next-ball', authenticateToken,checkRole(['organizer']),organizerController.getNextBallController);
router.post('/updateInningSummary',authenticateToken,checkRole(['organizer']), organizerController.updateInningSummary);
router.post('/updatePlayerStats',authenticateToken,checkRole(['organizer']), organizerController.updatePlayerStats);
router.put('/tournaments/updatestatus', organizerController.updateTournamentStatus);





module.exports = router;
