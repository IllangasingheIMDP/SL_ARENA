const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../../middleware/auth');

const playerController = require('../../controllers/playerController');

router.get("/playerPublicDetails/:playerId", authenticateToken, playerController.getPlayerPublicDetails);

module.exports = router;