const db = require("../config/dbconfig"); // assuming you use MySQL2 or similar


const getPlayerStats = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      COUNT(match_id) AS matches_played,
      SUM(runs_scored) AS total_runs,
      SUM(wickets_taken) AS total_wickets
    FROM Player_Match_Stats
    WHERE player_id = ?
  `,
    [userId]
  );

  return rows[0];
};

const getPlayerAchievements = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT 
        achievement_type, 
        match_id, 
        date_achieved 
      FROM Achievements
      WHERE player_id = ?
      ORDER BY date_achieved DESC
    `,
    [userId]
  );

  return rows;
};

const getPerformanceOverTime = async (playerId) => {
  const [rows] = await db.execute(
    `
      SELECT 
        m.match_date,
        pms.runs_scored,
        pms.wickets_taken
      FROM Player_Match_Stats pms
      JOIN Matches m ON pms.match_id = m.match_id
      WHERE pms.player_id = ?
      ORDER BY m.match_date ASC
    `,
    [playerId]
  );

  return rows;
};

const getPlayerProfileDetails = async (player_id) => {
  // Validate input
  if (!player_id || isNaN(player_id) || player_id <= 0) {
    console.log(`Invalid player_id: ${player_id}`);
    throw new Error('Invalid player_id. Must be a positive number.');
  }

  try {
    const [rows] = await db.execute(
      `SELECT 
		  u.name,
          p.player_id,
          u.name, 
          p.bio,
          p.batting_style,
          p.bowling_style,
          p.fielding_position,
          p.batting_points,
          p.bowling_points,
          p.allrounder_points,
          p.role,
          a.achievement_type,
          m.match_type,
          v.venue_name
       FROM 
          Players p
		LEFT JOIN
        Users u on p.player_id=u.user_id
       LEFT JOIN 
          Achievements a ON p.player_id = a.player_id
       LEFT JOIN 
          Matches m ON a.match_id = m.match_id
       LEFT JOIN 
          Venues v ON m.venue_id = v.venue_id
       WHERE 
          p.player_id = ?;`,
      [player_id]
    );
    
    // Check if rows is empty
    if (!rows || rows.length === 0) {
      console.log(`No profile found for player_id: ${player_id}`);
      throw new Error('Player profile not found');
    }

    // Transform data for frontend
    const profile = {
      player_id: rows[0].player_id,
      name: rows[0].name,
      bio: rows[0].bio || 'No bio available',
      batting_style: rows[0].batting_style || 'Unknown',
      bowling_style: rows[0].bowling_style || 'Unknown', // Fixed typo: was batting_style
      fielding_position: rows[0].fielding_position || 'Unknown',
      batting_points: rows[0].batting_points || 0,
      bowling_points: rows[0].bowling_points || 0,
      allrounder_points: rows[0].allrounder_points || 0,
      role: rows[0].role || 'Unknown',
      achievements: rows
        .filter((row) => row.achievement_type) // Exclude rows with null achievements
        .map((row) => ({
          achievement_type: row.achievement_type,
          match_type: row.match_type || 'N/A',
          venue_name: row.venue_name || 'N/A',
        })),
    };

    console.log(`Successfully fetched profile for player_id: ${player_id}`);
    return profile;
  } catch (error) {
    console.error(`Error fetching player profile for player_id: ${player_id}`, error);
    throw new Error(`Failed to fetch player profile: ${error.message || 'Unknown error'}`);
  }
};


const getPlayerVideos = async (playerId) => {
  // Validate input
  if (!playerId || isNaN(playerId) || playerId <= 0) {
   console.log(`Invalid playerId: ${playerId}`);
    throw new Error('Invalid playerId. Must be a positive number.');
  }

  try {
    // Execute the query
    const [rows] = await db.execute(
      'SELECT * FROM Videos WHERE user_id = ?;',
      [playerId]
    );

    // Log if no media is found
    if (rows.length === 0) {
      console.log(`No media found for playerId: ${playerId}`);
    }

    // Transform data: Extract video URLs into an array
    //const videoUrls = rows.map(row => row.video_url).filter(url => url); // Remove null/undefined URLs

    
    return rows;
  } catch (error) {
    console.log(`Error fetching player media for playerId: ${playerId}`, error);
    throw new Error(`Failed to fetch player media: ${error.message}`);
  }
};
const updateProfileBio = async (player_id, bio) => {
  try {
    // Validate player_id
    if (!player_id || isNaN(player_id) || player_id <= 0) {
      console.log(`Invalid player_id: ${player_id}`);
      throw new Error('Invalid player_id. Must be a positive number.');
    }

    // Convert undefined bio to null
    const sanitizedBio = bio ?? null; // Use null if bio is undefined
    console.log(`Updating bio for player_id: ${player_id}, bio: ${sanitizedBio}`);

    // Execute query
    await db.execute(
      `UPDATE Players SET bio = ? WHERE player_id = ?`,
      [sanitizedBio, player_id]
    );

    console.log(`Successfully updated bio for player_id: ${player_id}`);
    return { message: 'Bio updated successfully' };
  } catch (error) {
    console.error(`Error updating bio for playerId: ${player_id}`, error);
    throw new Error(`Failed to update bio: ${error.message}`);
  }
};


const getTrainingSessionsByPlayer = async (playerId) => {
  const [rows] = await db.execute(`
    SELECT 
      session_date,
      duration,
      focus_area,
      notes
    FROM Training_Sessions
    WHERE player_id = ?
    ORDER BY session_date DESC
  `, [playerId]);

  return rows;
};

const getAllPlayers = async () => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        p.player_id,
        u.name
      FROM Players p
      JOIN Users u ON p.player_id = u.user_id
      ORDER BY u.name ASC`
    );
    
    return rows;
  } catch (error) {
    console.error('Error fetching all players:', error);
    throw new Error(`Failed to fetch players: ${error.message || 'Unknown error'}`);
  }
};

const getTeamsByLeader = async (playerId) => {
  try {
    const [rows] = await db.execute(
      `SELECT team_name 
       FROM Teams 
       WHERE captain_id = ?`,
      [playerId]
    );

    return rows;
  } catch (error) {
    console.error(`Error fetching teams for leader: ${playerId}`, error);
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }
};



const getTournamentIdsByStatus = async (teamId, status) => {
  const [rows] = await db.execute(
    `SELECT tournament_id FROM tournament_applicants WHERE team_id = ? AND status = ?`,
    [teamId, status]
  );
  
  return rows.map(row => row.tournament_id);
};

// Get all tournament IDs the team is involved in (applied or accepted)
const getAllTournamentIdsForTeam = async (teamId) => {
  const [rows] = await db.execute(
    `SELECT tournament_id FROM tournament_applicants WHERE team_id = ?`,
    [teamId]
  );
  return rows.map(row => row.tournament_id);
};

// Fetch tournament details by list of tournament IDs
const getTournamentDetailsByIds = async (ids) => {
  if (ids.length === 0) return [];

  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await db.execute(
    `
    SELECT 
      t.tournament_id,
      t.tournament_name,
      t.start_date,
      t.rules,
      o.organizer_id,
      o.organization_name AS organizer_name,
      t.venue_id
    FROM Tournaments t
    JOIN Organizers o ON t.organizer_id = o.organizer_id
    WHERE t.tournament_id IN (${placeholders})
    `,
    ids
  );
  
  return rows;
};

// Get tournaments the team has NOT applied to or been accepted in
const getTournamentsNotApplied = async (excludeIds) => {
  let sql = `
    SELECT 
      t.tournament_id,
      t.tournament_name,
      t.start_date,
      t.rules,
      o.organizer_id,
      o.organization_name AS organizer_name,
      t.venue_id
    FROM Tournaments t
    JOIN Organizers o ON t.organizer_id = o.organizer_id
    
  `;

  let rows;
  if (excludeIds.length > 0) {
    const placeholders = excludeIds.map(() => '?').join(',');
    sql += ` WHERE t.tournament_id NOT IN (${placeholders})`;
    [rows] = await db.execute(sql, excludeIds);
  } else {
    [rows] = await db.execute(sql);
  }

  return rows;
};

const updatePlayerBattingStyle = async (player_id, batting_style) => {
  try {
    if (!player_id || isNaN(player_id) || player_id <= 0) {
      throw new Error('Invalid player_id. Must be a positive number.');
    }

    await db.execute(
      `UPDATE Players SET batting_style = ? WHERE player_id = ?`,
      [batting_style, player_id]
    );

    return { message: 'Batting style updated successfully' };
  } catch (error) {
    console.error(`Error updating batting style for playerId: ${player_id}`, error);
    throw new Error(`Failed to update batting style: ${error.message}`);
  }
};

const updatePlayerBowlingStyle = async (player_id, bowling_style) => {
  try {
    if (!player_id || isNaN(player_id) || player_id <= 0) {
      throw new Error('Invalid player_id. Must be a positive number.');
    }

    await db.execute(
      `UPDATE Players SET bowling_style = ? WHERE player_id = ?`,
      [bowling_style, player_id]
    );

    return { message: 'Bowling style updated successfully' };
  } catch (error) {
    console.error(`Error updating bowling style for playerId: ${player_id}`, error);
    throw new Error(`Failed to update bowling style: ${error.message}`);
  }
};

const updatePlayerFieldingPosition = async (player_id, fielding_position) => {
  try {
    if (!player_id || isNaN(player_id) || player_id <= 0) {
      throw new Error('Invalid player_id. Must be a positive number.');
    }

    await db.execute(
      `UPDATE Players SET fielding_position = ? WHERE player_id = ?`,
      [fielding_position, player_id]
    );

    return { message: 'Fielding position updated successfully' };
  } catch (error) {
    console.error(`Error updating fielding position for playerId: ${player_id}`, error);
    throw new Error(`Failed to update fielding position: ${error.message}`);
  }
};

const updatePlayerRole = async (player_id, role) => {
  try {
    if (!player_id || isNaN(player_id) || player_id <= 0) {
      throw new Error('Invalid player_id. Must be a positive number.');
    }

    // Validate role
    const validRoles = ['batting', 'bowling', 'allrounder'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be one of: batting, bowling, allrounder');
    }

    await db.execute(
      `UPDATE Players SET role = ? WHERE player_id = ?`,
      [role, player_id]
    );

    return { message: 'Player role updated successfully' };
  } catch (error) {
    console.error(`Error updating role for playerId: ${player_id}`, error);
    throw new Error(`Failed to update role: ${error.message}`);
  }

};

module.exports = {
  getPlayerStats,
  getPlayerAchievements,
  getPerformanceOverTime,
  getPlayerProfileDetails,
  getPlayerVideos,
  getTrainingSessionsByPlayer,
  updateProfileBio,
  getAllPlayers,
  getTeamsByLeader,

  getTournamentIdsByStatus,
  getAllTournamentIdsForTeam,
  getTournamentDetailsByIds,
  getTournamentsNotApplied,
 

  updatePlayerBattingStyle,
  updatePlayerBowlingStyle,
  updatePlayerFieldingPosition,
  updatePlayerRole

};

