const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, checkRole } = require('../middleware/auth');
// GET routes - accessible by all specified roles
router.get('/my-teams', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getMyTeams
);
router.get('/teams-led-by-player', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer'] ), 
    teamController.getTeamsLedByPlayer
);
router.get('/team-by-name/:team_name', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getTeamByName
);

router.get('/player/:user_id/teams', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getPlayerTeams
);

router.get('/', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getAllTeams
);

router.get('/:team_id/players', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getTeamPlayers
);


router.get('/player/teams', 
    authenticateToken,
    checkRole(['player']), 
    teamController.getTeamsByUserId
);
router.post('/apply-tournament', 
    authenticateToken,
    checkRole(['player']), 
    teamController.applyForTournament
);

router.get('/:team_id/is-captain', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.isUserTeamCaptain
);

router.get('/finished-tournaments', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getFinishedTournaments
);

router.get('/:team_id/myhistory-tournaments', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getMyHistoryTournaments
);

router.get('/upcoming-tournaments', 
    authenticateToken,
    checkRole(['player', 'admin', 'general', 'organisation', 'trainer']), 
    teamController.getUpcomingTournaments
);

router.post('/delete-team', 
    authenticateToken,
    checkRole(['player', 'admin', 'organisation', 'trainer']), 
    teamController.deleteTeam
);

// POST routes - accessible only by players
router.post('/', 
    authenticateToken,
    checkRole(['player']), 
    teamController.createTeam
);

router.post('/add-player', 
    authenticateToken,
    checkRole(['player']), 
    teamController.addPlayerToTeam
);

router.post('/remove-player', 
    authenticateToken,
    checkRole(['player', 'admin', 'organisation', 'trainer']), 
    teamController.removePlayerFromTeam
);

module.exports = router;
