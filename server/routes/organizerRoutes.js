const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/createtournament', authenticateToken,checkRole(['organizer']), organizerController.createTournament);
router.get('/alltournaments', authenticateToken,checkRole(['organizer']),organizerController.getTournamentsByOrganizer);


module.exports = router;
