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
    logger.error(`Invalid player_id: ${player_id}`);
    throw new Error("Invalid player_id. Must be a positive number.");
  }

  try {
    const [rows] = await db.execute(
      `SELECT 
          p.bio,
          p.batting_style,
          p.bowling_style,
          p.fielding_position,
          a.achievement_type,
          m.match_type,
          v.venue_name
        FROM Players p
        LEFT JOIN Achievements a ON p.player_id = a.player_id
        LEFT JOIN Matches m ON a.match_id = m.match_id
        LEFT JOIN Venues v ON m.venue_id = v.venue_id
        WHERE p.player_id = ?;`,
      [player_id]
    );

    const profile = {
      bio: rows[0]?.bio || "No bio available",
      batting_style: rows[0]?.batting_style || "Unknown",
      bowling_style: rows[0]?.bowling_style || "Unknown",
      fielding_position: rows[0]?.fielding_position || "Unknown",
      achievements: rows
        .filter((row) => row.achievement_type)
        .map((row) => ({
          achievement_type: row.achievement_type,
          match_type: row.match_type || "N/A",
          venue_name: row.venue_name || "N/A",
        })),
    };

    logger.info(`Successfully fetched profile for player_id: ${player_id}`);
    return profile;
  } catch (error) {
    logger.error(`Error fetching player profile for player_id: ${player_id}`, error);
    throw new Error(`Failed to fetch player profile: ${error.message}`);
  }
};


const getPlayerMedia = async (playerId) => {
  // Validate input
  if (!playerId || isNaN(playerId) || playerId <= 0) {
    logger.error(`Invalid playerId: ${playerId}`);
    throw new Error('Invalid playerId. Must be a positive number.');
  }

  try {
    // Execute the query
    const [rows] = await db.execute(
      'SELECT video_url FROM Videos WHERE user_id = ?;',
      [playerId]
    );

    // Log if no media is found
    if (rows.length === 0) {
      logger.info(`No media found for playerId: ${playerId}`);
    }

    // Transform data: Extract video URLs into an array
    const videoUrls = rows.map(row => row.video_url).filter(url => url); // Remove null/undefined URLs

    logger.info(`Successfully fetched ${videoUrls.length} video URLs for playerId: ${playerId}`);
    return videoUrls;
  } catch (error) {
    logger.error(`Error fetching player media for playerId: ${playerId}`, error);
    throw new Error(`Failed to fetch player media: ${error.message}`);
  }
};
const updateProfileBio = async (playerId, bio) => {
  // Validate input
  if (!playerId || isNaN(playerId) || playerId <= 0) {
    logger.error(`Invalid playerId: ${playerId}`);
    throw new Error('Invalid playerId. Must be a positive number.');
  }

  try {
    // Execute the update query
    const [result] = await db.execute(
      'UPDATE Players SET bio = ? WHERE player_id = ?',
      [bio, playerId]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      logger.warn(`No rows updated for playerId: ${playerId}`);
      return false;
    }

    logger.info(`Successfully updated bio for playerId: ${playerId}`);
    return true;
  } catch (error) {
    logger.error(`Error updating bio for playerId: ${playerId}`, error);
    throw new Error(`Failed to update bio: ${error.message}`);
  }
}


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


const getFilteredMatches = async ({ date, type, location }) => {
  let query = `
    SELECT m.*, v.venue_name, t1.team_name AS team1_name, t2.team_name AS team2_name
    FROM Matches m
    JOIN Venues v ON m.venue_id = v.venue_id
    JOIN Teams t1 ON m.team1_id = t1.team_id
    JOIN Teams t2 ON m.team2_id = t2.team_id
    WHERE 1 = 1
  `;
  const params = [];

  if (date) {
    query += ' AND m.match_date = ?';
    params.push(date);
  }

  if (type) {
    query += ' AND m.match_type = ?';
    params.push(type);
  }

  if (location) {
    query += ' AND v.venue_name LIKE ?';
    params.push(`%${location}%`);
  }

  const [rows] = await db.execute(query, params);
  return rows;
};


const getMatchDetails = async (matchId) => {
  const [rows] = await db.execute(
    `
    SELECT m.*, v.venue_name, t1.team_name AS team1_name, t2.team_name AS team2_name
    FROM Matches m
    JOIN Venues v ON m.venue_id = v.venue_id
    JOIN Teams t1 ON m.team1_id = t1.team_id
    JOIN Teams t2 ON m.team2_id = t2.team_id
    WHERE m.match_id = ?
    `,
    [matchId]
  );

  return rows[0];
};

module.exports = {
  
  
  
  getTrainingSessionsByPlayer,
  getPlayerStats,
  getPlayerAchievements,
  getPerformanceOverTime,
  getPlayerProfileDetails,
  getPlayerMedia,
  getFilteredMatches,
  getMatchDetails,
  updateProfileBio 
};

