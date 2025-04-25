const db = require("../config/dbconfig");

const createTournament = async (tournamentData) => {
    const {
        organizer_id,
        tournament_name,
        start_date,
        end_date,
        tournament_type,
        rules,
        venue_id
    } = tournamentData;

    try {
        const [tournamentResult] = await db.execute(
            `INSERT INTO Tournaments 
            (organizer_id, tournament_name, start_date, end_date, tournament_type, rules, status, venue_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [organizer_id, tournament_name, start_date, end_date, tournament_type, rules, 'upcoming', venue_id]
        );
        return tournamentResult.insertId;
    } catch (error) {
        throw error;
    }
};


const getTournamentsByOrganizer = async (organizer_id) => {
    const [rows] = await db.execute(
        `SELECT 
            t.tournament_id,
            t.tournament_name,
            t.start_date,
            t.end_date,
            t.tournament_type,
            t.rules,
            t.status,
            t.venue_id,
            u.user_id AS organizer_id,
            u.name AS organizer_name,
            u.email AS organizer_email
        FROM Tournaments t
        JOIN Users u ON t.organizer_id = u.user_id
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
      `SELECT 
          t.team_id, 
          t.team_name, 
          u.user_id AS captain_id, 
          u.name AS captain_name
       FROM tournament_applicants ta
       INNER JOIN Teams t ON ta.team_id = t.team_id
       INNER JOIN Users u ON t.captain_id = u.user_id
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


  const updateTournamentStatus = async (tournament_id, status) => {
    const [result] = await db.execute(
      `UPDATE Tournaments SET status = ? WHERE tournament_id = ?`,
      [status, tournament_id]
    );
    return result;
  };

  const markAttendance = async (ids) => {
    const placeholders = ids.map(() => '?').join(',');
    const sql = `
      UPDATE tournament_applicants
      SET attendance = TRUE
      WHERE id IN (${placeholders})
    `;
    const [result] = await db.execute(sql, ids);
    return result;
  };

  const updateTeamAttendance = async (tournamentId, teamId, isPresent) => {
    console.log("Update team attendance")
    console.log(tournamentId,teamId,isPresent)
    const [result] = await db.execute(
      `UPDATE tournament_applicants 
       SET attendance = ? 
       WHERE tournament_id = ? AND team_id = ?`,
      [isPresent, tournamentId, teamId]
    );
  
    return result;
  };



  const generateKnockoutDraw = async (tournament_id) => {
    const [teams] = await db.execute(
      `SELECT team_id FROM tournament_applicants WHERE tournament_id = ? AND status="accepted" AND attendance = TRUE`,
      [tournament_id]
    );
  
    const teamIds = teams.map(t => t.team_id);
    const totalTeams = teamIds.length;
  
    if (totalTeams < 2) throw new Error("Not enough teams to generate draw");
  
    // Shuffle
    for (let i = teamIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teamIds[i], teamIds[j]] = [teamIds[j], teamIds[i]];
    }
  
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalTeams)));
    const byes = nextPowerOfTwo - totalTeams;
  
    const round1Matches = [];
    const byeTeams = [];
  
    let matchNumber = 1;
  
    // Step 1: Assign byes
    for (let i = 0; i < byes; i++) {
      const team = teamIds.shift();
      byeTeams.push(team);
    }
  
    // Step 2: Create Round 1 matches
    while (teamIds.length >= 2) {
      const team1 = teamIds.shift();
      const team2 = teamIds.shift();
      round1Matches.push([tournament_id, 1, matchNumber++, team1, team2, null]);
    }
  
    const matches = [...round1Matches];
  
    // Step 3: Create Round 2 placeholders
    let round = 2;
    let teamsInRound = round1Matches.length + byeTeams.length;
    const round2Matches = [];
  
    const round2Count = Math.floor(teamsInRound / 2);
    for (let i = 0; i < round2Count; i++) {
      round2Matches.push({ tournament_id, round, match_number: matchNumber++, team1_id: null, team2_id: null, winner_id: null });
    }
  
    // Step 4: Assign bye teams to round 2
    for (const team of byeTeams) {
      for (let match of round2Matches) {
        if (!match.team1_id) {
          match.team1_id = team;
          break;
        } else if (!match.team2_id) {
          match.team2_id = team;
          break;
        }
      }
    }
  
    // Add Round 2 matches to matches array
    for (let m of round2Matches) {
      matches.push([
        m.tournament_id,
        m.round,
        m.match_number,
        m.team1_id,
        m.team2_id,
        m.winner_id
      ]);
    }
  
    // Step 5: Generate placeholders for further rounds
    teamsInRound = round2Matches.length;
  
    while (teamsInRound > 1) {
      const matchesInRound = Math.floor(teamsInRound / 2);
      for (let i = 0; i < matchesInRound; i++) {
        matches.push([tournament_id, ++round, matchNumber++, null, null, null]);
      }
      teamsInRound = matchesInRound;
    }
  
    // Final insert
    if (matches.length > 0) {
      await db.query(
        `INSERT INTO Matches (tournament_id, round, match_number, team1_id, team2_id, winner_id) VALUES ?`,
        [matches]
      );
    } else {
      throw new Error("No matches generated.");
    }
  };
  
  const updateMatchWinner = async (match_id, winner_id) => {
    await db.execute('UPDATE Matches SET winner_id = ? WHERE match_id = ?', [winner_id, match_id]);
  
    const [[match]] = await db.execute('SELECT * FROM Matches WHERE match_id = ?', [match_id]);
    const { tournament_id, round } = match;
  
    const [nextRoundMatches] = await db.execute(
      'SELECT * FROM Matches WHERE tournament_id = ? AND round = ? ORDER BY match_number ASC',
      [tournament_id, round + 1]
    );
  
    for (const nextMatch of nextRoundMatches) {
      if (!nextMatch.team1_id) {
        await db.execute('UPDATE Matches SET team1_id = ? WHERE match_id = ?', [winner_id, nextMatch.match_id]);
        break;
      } else if (!nextMatch.team2_id) {
        await db.execute('UPDATE Matches SET team2_id = ? WHERE match_id = ?', [winner_id, nextMatch.match_id]);
        break;
      }
    }
  };
  
  const viewKnockoutBracket = async (tournament_id) => {
    const [rows] = await db.execute(
        `SELECT m.match_id, m.round, m.match_number,
                m.team1_id, m.team2_id,
                t1.team_name AS team1_name,
                t2.team_name AS team2_name,
                w.team_name AS winner_name
         FROM Matches m
         LEFT JOIN Teams t1 ON m.team1_id = t1.team_id
         LEFT JOIN Teams t2 ON m.team2_id = t2.team_id
         LEFT JOIN Teams w ON m.winner_id = w.team_id
         WHERE m.tournament_id = ?
         ORDER BY m.round, m.match_number`,
        [tournament_id]
      );
      
  
    return rows;
  };
  
  
  



  const getUpcomingTournaments = async () => {
    try{
        const [rows] = await db.execute(
            `select T.organizer_id , T.tournament_name , T.start_date , T.end_date , T.tournament_type , T.rules, T.venue_id
            from Tournaments T
            where T.status='upcoming';`
        );
        return rows;
    }catch(error){
        throw error;
    }
  };


  const insertPlaying11 = async (players) => {
    if (!players.length) return;
  
    const values = players.map(() => '(?, ?)').join(', ');
    const params = players.flatMap(p => [p.match_id, p.player_id]);
  
    const sql = `
      INSERT INTO playing_11 (match_id, player_id)
      VALUES ${values}
    `;
  
    await db.execute(sql, params);
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
    updatePlayerStats,
    updateTournamentStatus,
    markAttendance,
    updateTeamAttendance,
    generateKnockoutDraw,
    updateMatchWinner,
    viewKnockoutBracket,
    getUpcomingTournaments,
    insertPlaying11

};
