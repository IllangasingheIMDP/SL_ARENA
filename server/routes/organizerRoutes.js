const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/createtournament', authenticateToken,checkRole(['organizer']), organizerController.createTournament);
router.get('/alltournaments', authenticateToken,checkRole(['organizer']),organizerController.getTournamentsByOrganizer);
router.get('/applied-teams',authenticateToken,checkRole(['organizer']), organizerController.getAppliedTeamsToOngoingTournaments);
// POST /api/tournaments/applicants/accept
router.post('/applicants/accept', organizerController.acceptTournamentApplicant);

// POST /api/tournaments/applicants/reject
router.post('/applicants/reject', organizerController.rejectTournamentApplicant);



module.exports = router;
