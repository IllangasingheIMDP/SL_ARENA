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
          p.bio,
          p.batting_style,
          p.bowling_style,
          p.fielding_position,
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
      bio: rows[0].bio || 'No bio available',
      batting_style: rows[0].batting_style || 'Unknown',
      bowling_style: rows[0].bowling_style || 'Unknown', // Fixed typo: was batting_style
      fielding_position: rows[0].fielding_position || 'Unknown',
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

const getPlayerMedia = async (playerId) => {
  // Validate input
  if (!playerId || isNaN(playerId) || playerId <= 0) {
   console.log(`Invalid playerId: ${playerId}`);
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
      console.log(`No media found for playerId: ${playerId}`);
    }

    // Transform data: Extract video URLs into an array
    const videoUrls = rows.map(row => row.video_url).filter(url => url); // Remove null/undefined URLs

    console.log(`Successfully fetched ${videoUrls.length} video URLs for playerId: ${playerId}`);
    return videoUrls;
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

module.exports = {
  getPlayerStats,
  getPlayerAchievements,
  getPerformanceOverTime,
  getPlayerProfileDetails,
  getPlayerMedia,
  getTrainingSessionsByPlayer,
  updateProfileBio
};

