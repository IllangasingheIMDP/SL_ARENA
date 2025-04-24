const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/createtournament', authenticateToken,checkRole(['organizer']), organizerController.createTournament);
router.get('/ongoingtournaments', authenticateToken,checkRole(['organizer']),organizerController.getTournamentsByOrganizer);
router.get('/applied-teams',authenticateToken,checkRole(['organizer']), organizerController.getAppliedTeamsToOngoingTournaments);
router.post('/applicants/accept',authenticateToken,checkRole(['organizer']), organizerController.acceptTournamentApplicant);
router.post('/applicants/reject',authenticateToken,checkRole(['organizer']), organizerController.rejectTournamentApplicant);
router.post('/accepted-teams', authenticateToken,checkRole(['organizer']),organizerController.getAcceptedTeamsByTournament);
router.post('/players-stats_ofTeam', authenticateToken,checkRole(['organizer']),organizerController.getPlayersWithStats);
router.post('/not-applied-teams',authenticateToken,checkRole(['organizer']), organizerController.getTeamsNotApplied);
router.post('/send-invite',authenticateToken,checkRole(['organizer']), organizerController.sendTournamentInvite);



module.exports = router;
