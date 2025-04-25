const Team = require('../models/teamModel');

// Get teams for the authenticated user
const getMyTeams = async (req, res) => {
    try {
        const playerId = req.user.user_id;
        const teams = await Team.getPlayerTeams(playerId);
        res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        console.log(error,'error in getMyTeams');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get teams for a specific player
const getPlayerTeams = async (req, res) => {
    try {
        const playerId = req.params.user_id;
        const teams = await Team.getPlayerTeams(playerId);
        res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        console.log(error,'error in getPlayerTeams');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.getAllTeams();
        res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        console.log(error,'error in getAllTeams');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get team players
const getTeamPlayers = async (req, res) => {
    try {
        const teamId = req.params.team_id;
        const players = await Team.getTeamPlayers(teamId);
        res.status(200).json({
            success: true,
            data: players
        });
    } catch (error) {
        console.log(error,'error in getTeamPlayers');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new team
const createTeam = async (req, res) => {
    try {
        const { team_name } = req.body;
        const captainId = req.user.user_id;

        if (!team_name) {

            return res.status(400).json({
                success: false,
                message: 'Team name is required'
            });
        }

        const teamId = await Team.createTeam(team_name, captainId);
        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            data: { team_id: teamId }
        });
    } catch (error) {
        console.log(error,'error in createTeam');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add player to team
const addPlayerToTeam = async (req, res) => {
    try {
        const { team_id, player_id, role } = req.body;

        if (!team_id || !player_id || !role) {
            return res.status(400).json({
                success: false,
                message: 'Team ID, player ID, and role are required'
            });
        }

        await Team.addPlayerToTeam(team_id, player_id, role);
        res.status(200).json({
            success: true,
            message: 'Player added to team successfully'
        });
    } catch (error) {
        console.log(error,'error in addPlayerToTeam');
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyTeams,
    getPlayerTeams,
    getAllTeams,
    getTeamPlayers,
    createTeam,
    addPlayerToTeam
};
