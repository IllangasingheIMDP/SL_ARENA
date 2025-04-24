const db = require("../config/dbconfig");

const createTournament = async (tournamentData) => {
    const {
        organizer_id,
        tournament_name,
        start_date,
        end_date,
        tournament_type,
        rules
    } = tournamentData;

    const [result] = await db.execute(
        `INSERT INTO Tournaments 
        (organizer_id, tournament_name, start_date, end_date, tournament_type, rules,status) 
        VALUES (?, ?, ?, ?, ?, ?,?)`,
        [organizer_id, tournament_name, start_date, end_date, tournament_type, rules,'ongoing']
    );

    return result.insertId;
};


const getTournamentsByOrganizer = async (organizer_id) => {
    const [rows] = await db.execute(
        `SELECT 
    t.*, 
    u.name AS organizer_name,
    v.venue_id,
    v.venue_name,
    v.address,
    v.city,
    v.state,
    v.country,
    v.latitude,
    v.longitude,
    v.capacity
FROM Tournaments t
JOIN Users u ON t.organizer_id = u.user_id
LEFT JOIN Venues v ON t.venue_id = v.venue_id
WHERE t.organizer_id = ?
  AND t.status IN ('start', 'matches');
`,
        [organizer_id]
    );
    return rows;
};

const getAppliedTeamsToOngoingTournamentsByOrganizer = async (organizer_id) => {
    const [rows] = await db.execute(
        `SELECT 
            ta.id,
            ta.team_id,
            t.team_name
         FROM tournament_applicants ta
         INNER JOIN Tournaments tor ON ta.tournament_id = tor.tournament_id
         INNER JOIN Teams t ON ta.team_id = t.team_id
         WHERE tor.organizer_id = ? AND tor.status = 'ongoing' AND ta.status = 'applied'`,
        [organizer_id]
    );
    return rows;
};


const updateApplicantStatus = async (id, status) => {
    const [result] = await db.execute(
        `UPDATE tournament_applicants SET status = ? WHERE id = ?`,
        [status, id]
    );
    return result;
};

const getAcceptedTeamsByTournament = async (tournament_id) => {
    const [rows] = await db.execute(
        `SELECT t.team_id, t.team_name
         FROM tournament_applicants ta
         INNER JOIN Teams t ON ta.team_id = t.team_id
         WHERE ta.tournament_id = ? AND ta.status = 'accepted'`,
        [tournament_id]
    );
    return rows;
};

const getPlayersWithStatsByTeam = async (team_id) => {
    const [rows] = await db.execute(
        `SELECT 
            u.user_id AS player_id,
            u.name,
            tp.role,
            COUNT(DISTINCT pms.match_id) AS total_matches,
            SUM(pms.runs_scored) AS total_runs,
            SUM(pms.wickets_taken) AS total_wickets,
            ROUND(CASE WHEN COUNT(DISTINCT pms.match_id) > 0 THEN SUM(pms.runs_scored) / COUNT(DISTINCT pms.match_id) ELSE 0 END, 2) AS batting_average,
            ROUND(CASE WHEN SUM(pms.overs_bowled) > 0 THEN SUM(pms.runs_conceded) / SUM(pms.overs_bowled) ELSE 0 END, 2) AS bowling_economy
        FROM Team_Players tp
        JOIN Users u ON tp.player_id = u.user_id
        LEFT JOIN Player_Match_Stats pms ON tp.player_id = pms.player_id
        WHERE tp.team_id = ?
        GROUP BY u.user_id, u.name, tp.role`,
        [team_id]
    );
    return rows;
};

const getTeamsNotAppliedToTournament = async (tournament_id) => {
    const [rows] = await db.execute(
        `SELECT 
            t.team_id, 
            t.team_name, 
            t.captain_id, 
            u.name AS captain_name
        FROM Teams t
        JOIN Users u ON t.captain_id = u.user_id
        WHERE t.team_id NOT IN (
            SELECT team_id FROM tournament_applicants WHERE tournament_id = ?
        )`,
        [tournament_id]
    );
    return rows;
};


const createTournamentInvite = async (tournament_id, team_id) => {
    const [result] = await db.execute(
        `INSERT INTO tournament_invites (tournament_id, team_id, status) VALUES (?, ?, 'Invited')`,
        [tournament_id, team_id]
    );
    return result.insertId;
};


const createInning = async (match_id, batting_team_id, bowling_team_id) => {
    // Step 1: Get current count of innings for this match
    const [rows] = await db.execute(
        'SELECT COUNT(*) AS inningCount FROM Innings WHERE match_id = ?',
        [match_id]
    );
    const inningNumber = rows[0].inningCount + 1;

    // Step 2: Insert the new inning
    const [result] = await db.execute(
        `INSERT INTO Innings (match_id, batting_team_id, bowling_team_id, inning_number)
         VALUES (?, ?, ?, ?)`,
        [match_id, batting_team_id, bowling_team_id, inningNumber]
    );

    return result;
};


const insertDelivery = async (delivery) => {
    const {
        inning_id,
        over_number,
        ball_number,
        batsman_id,
        bowler_id,
        runs_scored,
        extras,
        wicket,
        dismissal_type,
        extra_type
    } = delivery;

    const [result] = await db.execute(
        `INSERT INTO Deliveries (
            inning_id,
            over_number,
            ball_number,
            batsman_id,
            bowler_id,
            runs_scored,
            extras,
            wicket,
            dismissal_type,
            extra_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            inning_id,
            over_number,
            ball_number,
            batsman_id,
            bowler_id,
            runs_scored || 0,
            extras || 0,
            wicket || false,
            dismissal_type || null,
            extra_type || null
        ]
    );

    return result;
};

const getCurrentBatsmenRuns = async (inning_id) => {
    // Step 1: Get batsmen who have faced deliveries and are NOT out
    const [activeBatsmenRows] = await db.execute(
        `SELECT d.batsman_id
         FROM Deliveries d
         LEFT JOIN (
             SELECT batsman_id
             FROM Deliveries
             WHERE inning_id = ? AND wicket = 1
         ) AS out_batsmen
         ON d.batsman_id = out_batsmen.batsman_id
         WHERE d.inning_id = ? AND out_batsmen.batsman_id IS NULL
         ORDER BY d.delivery_id DESC`,
        [inning_id, inning_id]
    );

    // Get unique, not-out batsmen (latest 2)
    const uniqueBatsmen = [...new Set(activeBatsmenRows.map(row => row.batsman_id))].slice(0, 2);

    if (uniqueBatsmen.length === 0) return [];

    // Step 2: Fetch total runs + name
    const placeholders = uniqueBatsmen.map(() => '?').join(',');
    const [runsData] = await db.query(
        `SELECT d.batsman_id, u.name AS batsman_name, SUM(d.runs_scored) AS total_runs
         FROM Deliveries d
         JOIN Users u ON d.batsman_id = u.user_id
         WHERE d.inning_id = ? AND d.batsman_id IN (${placeholders})
         GROUP BY d.batsman_id`,
        [inning_id, ...uniqueBatsmen]
    );

    return runsData;
};

const getNextBall = async (inning_id) => {
    const [rows] = await db.execute(
        `SELECT over_number, ball_number, extra_type
         FROM Deliveries
         WHERE inning_id = ?
         ORDER BY over_number DESC, ball_number DESC, delivery_id DESC
         LIMIT 1`,
        [inning_id]
    );

    if (rows.length === 0) {
        // First ball of the innings
        return { over_number: 1, ball_number: 1 };
    }

    const { over_number, ball_number, extra_type } = rows[0];

    if (extra_type === 'wide' || extra_type === 'no ball') {
        // Same over and ball (illegal delivery)
        return { over_number, ball_number };
    }

    if (ball_number === 6) {
        return { over_number: over_number + 1, ball_number: 1 };
    }

    return { over_number, ball_number: ball_number + 1 };
};

const updateInningSummary = async (inning_id) => {
    // Get total runs (runs_scored + extras), total wickets, overs
    const [summary] = await db.execute(
      `SELECT 
        SUM(runs_scored + extras) AS total_runs,
        SUM(wicket) AS total_wickets,
        COUNT(*) / 6 AS overs_played
      FROM Deliveries
      WHERE inning_id = ?`,
      [inning_id]
    );
  
    const { total_runs, total_wickets, overs_played } = summary[0];
    
    const overVal = parseFloat(Number(overs_played || 0).toFixed(1));
  
    // Update Innings table
    await db.execute(
        `UPDATE Innings SET 
          total_runs = ?, 
          total_wickets = ?, 
          overs_played = ?
        WHERE inning_id = ?`,
        [total_runs || 0, total_wickets || 0, overVal, inning_id]
      );
  
    return summary[0];
  };

  const updatePlayerStats = async (match_id) => {
    // ✅ Batting stats - insert or update by adding
    await db.execute(
      `INSERT INTO Player_Match_Stats (
        player_id, match_id, runs_scored, balls_faced, fours, sixes,
        wickets_taken, overs_bowled, runs_conceded
      )
      SELECT 
        batsman_id, ?, 
        SUM(runs_scored), 
        COUNT(*), 
        SUM(CASE WHEN runs_scored = 4 THEN 1 ELSE 0 END),
        SUM(CASE WHEN runs_scored = 6 THEN 1 ELSE 0 END),
        0, 0.0, 0
      FROM Deliveries d
      JOIN Innings i ON d.inning_id = i.inning_id
      WHERE i.match_id = ?
      GROUP BY batsman_id
      ON DUPLICATE KEY UPDATE
        runs_scored = runs_scored + VALUES(runs_scored),
        balls_faced = balls_faced + VALUES(balls_faced),
        fours = fours + VALUES(fours),
        sixes = sixes + VALUES(sixes)`,
      [match_id, match_id]
    );
  
    // ✅ Bowling stats - insert or update by adding
    await db.execute(
      `INSERT INTO Player_Match_Stats (
        player_id, match_id, runs_scored, balls_faced, fours, sixes,
        wickets_taken, overs_bowled, runs_conceded
      )
      SELECT 
        bowler_id, ?, 
        0, 0, 0, 0,
        SUM(CASE WHEN wicket = 1 THEN 1 ELSE 0 END), 
        COUNT(*) / 6,
        SUM(runs_scored + extras)
      FROM Deliveries d
      JOIN Innings i ON d.inning_id = i.inning_id
      WHERE i.match_id = ?
      GROUP BY bowler_id
      ON DUPLICATE KEY UPDATE
        wickets_taken = wickets_taken + VALUES(wickets_taken),
        overs_bowled = overs_bowled + VALUES(overs_bowled),
        runs_conceded = runs_conceded + VALUES(runs_conceded)`,
      [match_id, match_id]
    );
  
    return { message: 'Player stats updated by adding new values.' };
  };
  



module.exports = {
    createTournament,
    getTournamentsByOrganizer,
    getAppliedTeamsToOngoingTournamentsByOrganizer,
    updateApplicantStatus,
    getAcceptedTeamsByTournament,
    getPlayersWithStatsByTeam,
    getTeamsNotAppliedToTournament,
    createTournamentInvite,
    createInning,
    insertDelivery,
    getCurrentBatsmenRuns,
    getNextBall,
    updateInningSummary,
    updatePlayerStats
};
