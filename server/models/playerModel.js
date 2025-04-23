const db = require('../config/dbconfig'); // assuming you use MySQL2 or similar

const getPlayerStats = async (userId) => {
  const [rows] = await db.execute(`
    SELECT 
      COUNT(match_id) AS matches_played,
      SUM(runs_scored) AS total_runs,
      SUM(wickets_taken) AS total_wickets
    FROM Player_Match_Stats
    WHERE player_id = ?
  `, [userId]);

  return rows[0];
};

const getPlayerAchievements = async (userId) => {
    const [rows] = await db.execute(`
      SELECT 
        achievement_type, 
        match_id, 
        date_achieved 
      FROM Achievements
      WHERE player_id = ?
      ORDER BY date_achieved DESC
    `, [userId]);
  
    return rows;
  };


  const getPerformanceOverTime = async (playerId) => {
    const [rows] = await db.execute(`
      SELECT 
        m.match_date,
        pms.runs_scored,
        pms.wickets_taken
      FROM Player_Match_Stats pms
      JOIN Matches m ON pms.match_id = m.match_id
      WHERE pms.player_id = ?
      ORDER BY m.match_date ASC
    `, [playerId]);
  
    return rows;
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
    getTrainingSessionsByPlayer
 };