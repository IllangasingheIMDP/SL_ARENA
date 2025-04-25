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

module.exports = router;
