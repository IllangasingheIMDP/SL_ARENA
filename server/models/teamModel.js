const db = require("../config/dbconfig"); // assuming you use MySQL2 or similar

// Get team details for a specific player
const getPlayerTeams = async (playerId) => {
    try {
        const query = `
            SELECT t.* 
            FROM Teams t
            INNER JOIN Team_Players tp ON t.team_id = tp.team_id
            WHERE tp.player_id = ?
        `;
        const [teams] = await db.query(query, [playerId]);
        return teams;
    } catch (error) {
        throw new Error(`Error getting player teams: ${error.message}`);
    }
};

// Get all teams
const getAllTeams = async () => {
    try {
        const query = `SELECT * FROM Teams`;
        const [teams] = await db.query(query);
        return teams;
    } catch (error) {
        throw new Error(`Error getting all teams: ${error.message}`);
    }
};

// Get team players by team ID
const getTeamPlayers = async (teamId) => {
    try {
        const query = `
            SELECT p.*, tp.role
            FROM Team_Players tp
            INNER JOIN Players p ON tp.player_id = p.player_id
            WHERE tp.team_id = ?
        `;
        const [players] = await db.query(query, [teamId]);
        return players;
    } catch (error) {
        throw new Error(`Error getting team players: ${error.message}`);
    }
};

// Create a new team
const createTeam = async (teamName, captainId) => {
    try {
        const query = `
            INSERT INTO Teams (team_name, captain_id, points)
            VALUES (?, ?, 0)
        `;
        const [result] = await db.query(query, [teamName, captainId]);
        
        // Add captain to Team_Players
        if (result.insertId) {
            await addPlayerToTeam(result.insertId, captainId, 'Captain');
        }
        
        return result.insertId;
    } catch (error) {
        throw new Error(`Error creating team: ${error.message}`);
    }
};

// Add player to team
const addPlayerToTeam = async (teamId, playerId, role) => {
    try {
        const query = `
            INSERT INTO Team_Players (team_id, player_id, role)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [teamId, playerId, role]);
        return result;
    } catch (error) {
        throw new Error(`Error adding player to team: ${error.message}`);
    }
};

module.exports = {
    getPlayerTeams,
    getAllTeams,
    getTeamPlayers,
    createTeam,
    addPlayerToTeam
};

