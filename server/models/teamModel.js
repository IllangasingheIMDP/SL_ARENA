const db = require("../config/dbconfig"); // assuming you use MySQL2 or similar

// Get team details for a specific player
const getPlayerTeams = async (playerId) => {
    try {
        const query = `
            SELECT t.team_id,t.team_name,t.points,u.name as captain
            FROM Teams t
            INNER JOIN Team_Players tp ON t.team_id = tp.team_id
            INNER JOIN Users u ON t.captain_id = u.user_id
            WHERE tp.player_id = ?
        `;
        const [teams] = await db.query(query, [playerId]);
        return teams;
    } catch (error) {
        throw new Error(`Error getting player teams: ${error.message}`);
    }
};

const getTeamsLeadByPlayer = async (playerId) => {
    try {
        const query = `
            SELECT DISTINCT t.team_id, t.team_name, t.points, u.name AS captain
            FROM Teams t
            INNER JOIN Users u ON t.captain_id = u.user_id
            WHERE t.captain_id = ?
        `;
        const [teams] = await db.query(query, [playerId]);
        return teams;
    } catch (error) {
        throw new Error(`Error getting teams led by player: ${error.message}`);
    }
};

// Get all teams
const getAllTeams = async () => {
    try {
        const query = `SELECT t.team_name,u.name FROM Teams as t left join Users as u on t.captain_id =u.user_id;`;
        const [teams] = await db.query(query);
        return teams;
    } catch (error) {
        throw new Error(`Error getting all teams: ${error.message}`);
    }
};

const getTeamByName = async (teamName, options = {}) => {
    // Validate input
    if (!teamName || typeof teamName !== 'string') {
      throw new Error('Team name must be a non-empty string');
    }
  
    try {
      // Default options
      const { caseSensitive = false, exactMatch = true } = options;
  
      // Sanitize team name
      const sanitizedName = teamName.trim();
  
      // Base query
      let query = `
        SELECT t.team_name, u.name AS captain, t.points 
        FROM Teams t 
        INNER JOIN Users u ON u.user_id = t.captain_id 
        WHERE t.team_name ${exactMatch ? '=' : 'LIKE'} ?
      `;
  
      // Prepare search parameter
      const searchParam = exactMatch ? sanitizedName : `%${sanitizedName}%`;
  
      // Handle case sensitivity
      if (!caseSensitive) {
        query = `
          SELECT t.team_name, u.name AS captain, t.points 
          FROM Teams t 
          INNER JOIN Users u ON u.user_id = t.captain_id 
          WHERE LOWER(t.team_name) ${exactMatch ? '=' : 'LIKE'} ?
        `;
      }
  
      const searchValue = caseSensitive ? searchParam : searchParam.toLowerCase();
  
      // Execute query
      console.log(query,'query in getTeamByName');
      const [teams] = await db.query(query, [searchValue]);
  
      // Return null if no team found
      return teams.length > 0 ? teams : null;
    } catch (error) {
      // Log error for debugging (in production, use proper logging)
      console.error('Team search error:', error);
      throw new Error(`Failed to retrieve team: ${error.message}`);
    }
  };

// Get team players by team ID
const getTeamPlayers = async (teamId) => {
    try {
        const query = `
            SELECT u.name,u.user_id as player_id,tp.role
            FROM Team_Players tp
			inner join Users u on u.user_id=tp.player_id
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
        
       
        
        return result.insertId;
    } catch (error) {
        throw new Error(`Error creating team: ${error.message}`);
    }
};

const deleteTeam = async (teamId) => {
    try {
        const query = `
            DELETE FROM Teams WHERE team_id = ?
        `;
        const [result] = await db.query(query, [teamId]);
        return result;
    } catch (error) {
        throw new Error(`Error deleting team: ${error.message}`);
    }
}

const removePlayerFromTeam = async (teamId, playerId) => {
    try {
        const query = `
            DELETE FROM Team_Players WHERE team_id = ? AND player_id = ?
        `;
        const [result] = await db.query(query, [teamId, playerId]);
        return result;
    } catch (error) {
        throw new Error(`Error removing player from team: ${error.message}`);
    }
}   
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

// Get all teams associated with a user (both as captain and player)
const getTeamsByUserId = async (userId) => {
    try {
        const query = `
            (SELECT DISTINCT t.team_id, t.team_name
            FROM Teams t
            WHERE t.captain_id = ?)
            UNION
            (SELECT DISTINCT t.team_id, t.team_name
            FROM Teams t
            INNER JOIN Team_Players tp ON t.team_id = tp.team_id
            WHERE tp.player_id = ?)
        `;
        const [teams] = await db.query(query, [userId, userId]);
        return teams;
    } catch (error) {
        throw new Error(`Error getting teams by user ID: ${error.message}`);
    }
};

const isUserTeamCaptain = async (teamId, userId) => {
    try {
        const query = `
            SELECT COUNT(*) as count
            FROM Teams
            WHERE team_id = ? AND captain_id = ?
        `;
        const [result] = await db.query(query, [teamId, userId]);
        return result[0].count > 0;
    } catch (error) {
        throw new Error(`Error checking if user is team captain: ${error.message}`);
    }
};

const getFinishedTournaments = async () => {
    try {
        const query = `
            SELECT 
                t.tournament_id,
                t.tournament_name,
                t.start_date,
                t.end_date,
                t.tournament_type,
                t.rules,
                t.venue_id,
                o.organization_name
            FROM Tournaments t
            LEFT JOIN Organizers o ON t.organizer_id = o.organizer_id
            WHERE t.status = 'finished'
            ORDER BY t.end_date DESC
        `;
        const [tournaments] = await db.query(query);
        return tournaments;
    } catch (error) {
        throw new Error(`Error getting tournaments with organizations: ${error.message}`);
    }
};

module.exports = {
    getPlayerTeams,
    getAllTeams,
    getTeamPlayers,
    createTeam,
    addPlayerToTeam,
    getTeamByName,
    getTeamsLeadByPlayer,
    getTeamsByUserId,
    removePlayerFromTeam,
    deleteTeam,
    isUserTeamCaptain,
    getFinishedTournaments
};

