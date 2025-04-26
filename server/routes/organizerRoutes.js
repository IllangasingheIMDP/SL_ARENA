const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.post('/createtournament', authenticateToken,checkRole(['organisation']), organizerController.createTournament);
router.get('/ongoingtournaments', authenticateToken,checkRole(['organisation']),organizerController.getTournamentsByOrganizerController);
router.get('/ongoingtournaments/all', authenticateToken,checkRole(['general','organisation','admin','player']),organizerController.getAllOngoingTournaments);
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
router.put('/tournaments/:tournamentId/teams/:teamId/attendance', authenticateToken,checkRole(['organisation']),organizerController.updateTeamAttendance);
router.put('/tournaments/updatestatus', authenticateToken,checkRole(['organisation']),organizerController.updateTournamentStatus);
router.post('/tournaments/generateKnockoutDraw',authenticateToken,checkRole(['organisation']),organizerController.createKnockoutDraw);
router.get('/tournaments/knockoutBracket/:tournament_id',authenticateToken,checkRole(['organisation']),organizerController.viewKnockoutBracket);
router.post('/tournaments/updateMatchWinner',authenticateToken,checkRole(['organisation']),organizerController.updateMatchWinner)
router.get('/upcoming-tournaments', authenticateToken,checkRole(['organisation']), organizerController.getUpcomingTournaments);
router.post('/playing-11',authenticateToken,checkRole(['organisation']), organizerController.addPlaying11);
router.get('/innings/:inning_id', authenticateToken,checkRole(['organisation']),organizerController.getInningStats);
router.get('/match-phase/:matchId', authenticateToken, checkRole(['organisation']), organizerController.getMatchPhaseController);
router.post('/update-match-phase', authenticateToken, checkRole(['organisation']), organizerController.updateMatchPhaseController);
router.get('/matches/:matchId', authenticateToken, checkRole(['organisation']), organizerController.getMatchDetailsController);
router.get('/teams/:teamId', authenticateToken, checkRole(['organisation']), organizerController.getTeamDetailsController);
router.post('/save-match-result', authenticateToken, checkRole(['organisation']), organizerController.saveMatchResultController);
router.get('/match-score/:matchId', authenticateToken, checkRole(['organisation']), organizerController.getMatchScoreController);
router.post('/save-inning-result', authenticateToken, checkRole(['organisation']), organizerController.saveInningResultController);
router.get('/match-state/:matchId', authenticateToken, checkRole(['organisation']), organizerController.getMatchStateController);
router.get('/applied-requests/:tournament_id',authenticateToken,checkRole(['organisation']),organizerController.getApplieddRequestsByTournamentID);
router.delete('/reject-req/:tournament_id/:team_id',authenticateToken,checkRole(['organisation']),organizerController.deleteAppliedRequest);
router.put('/accept-req/:tournament_id/:team_id',authenticateToken,checkRole(['organisation']),organizerController.acceptAppliedRequest);


module.exports = router;
