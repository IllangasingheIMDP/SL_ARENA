const db = require("../config/dbconfig");

const createTournament = async (tournamentData) => {
  const {
    organizer_id,
    tournament_name,
    start_date,
    end_date,
    tournament_type,
    rules,
    venue_id,
  } = tournamentData;

  try {
    const [tournamentResult] = await db.execute(
      `INSERT INTO Tournaments 
            (organizer_id, tournament_name, start_date, end_date, tournament_type, rules, status, venue_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        organizer_id,
        tournament_name,
        start_date,
        end_date,
        tournament_type,
        rules,
        "upcoming",
        venue_id,
      ]
    );
    return tournamentResult.insertId;
  } catch (error) {
    throw error;
  }
};

const getAllOngoingTournaments = async () => {
  const [rows] = await db.execute(
    `SELECT tournament_id, tournament_name, venue_id, tournament_type FROM Tournaments WHERE status IN ('start', 'matches');`
  );
  return rows;
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

const getUpcomingTournaments = async () => {
  try {
    const [rows] = await db.execute(
      `select T.organizer_id, T.tournament_id, T.tournament_name, T.start_date, T.end_date, T.tournament_type, T.rules, T.venue_id
       from Tournaments T
       where T.status='upcoming';`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getInningStatsById = async (inning_id) => {
  const [rows] = await db.execute(
    `SELECT total_runs, total_wickets 
       FROM Innings 
       WHERE inning_id = ?`,
    [inning_id]
  );
  return rows[0];
};

const getMatchPhase = async (matchId) => {
  try {
    const [rows] = await db.execute(
      "SELECT phase FROM Matches WHERE match_id = ?",
      [matchId]
    );

    if (rows.length === 0) {
      return { phase: "toss" }; // Default phase
    }

    return { phase: rows[0].phase || "toss" };
  } catch (error) {
    console.error("Error getting match phase:", error);
    throw error;
  }
};

const saveMatchPhase = async (matchId, phase) => {
  try {
    const [result] = await db.execute(
      "UPDATE Matches SET phase = ? WHERE match_id = ?",
      [phase, matchId]
    );

    return result;
  } catch (error) {
    console.error("Error saving match phase:", error);
    throw error;
  }
};

const getMatchDetails = async (matchId) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.*, 
              t1.team_name AS team1_name, 
              t2.team_name AS team2_name,
              t1.team_id AS team1_id,
              t2.team_id AS team2_id,
              m.phase
       FROM Matches m
       LEFT JOIN Teams t1 ON m.team1_id = t1.team_id
       LEFT JOIN Teams t2 ON m.team2_id = t2.team_id
       WHERE m.match_id = ?`,
      [matchId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error getting match details:", error);
    throw error;
  }
};

const getTeamDetails = async (teamId) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Teams WHERE team_id = ?", [
      teamId,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error getting team details:", error);
    throw error;
  }
};

const saveMatchResult = async (matchId, winnerTeamId) => {
  try {
    const [result] = await db.execute(
      "UPDATE Matches SET winner_id = ? WHERE match_id = ?",
      [winnerTeamId, matchId]
    );

    return result;
  } catch (error) {
    console.error("Error saving match result:", error);
    throw error;
  }
};

const getMatchScore = async (matchId) => {
  try {
    // Get innings for this match
    const [innings] = await db.execute(
      `SELECT inning_id, batting_team_id, bowling_team_id, inning_number, 
              total_runs, total_wickets, overs_played 
       FROM Innings 
       WHERE match_id = ? 
       ORDER BY inning_number`,
      [matchId]
    );

    if (innings.length === 0) {
      return {
        team1: {
          total: 0,
          wickets: 0,
          overs: 0,
          run_rate: 0,
          players: [],
          bowlers: [],
        },
        team2: {
          total: 0,
          wickets: 0,
          overs: 0,
          run_rate: 0,
          players: [],
          bowlers: [],
        },
      };
    }

    const result = {};

    // Process each inning
    for (let i = 0; i < innings.length; i++) {
      const inning = innings[i];
      const teamKey = i === 0 ? "team1" : "team2";

      // Get batsmen stats
      const [batsmen] = await db.execute(
        `SELECT d.batsman_id as player_id, 
                u.name, 
                SUM(d.runs_scored) as runs, 
                COUNT(d.delivery_id) as balls,
                SUM(CASE WHEN d.runs_scored = 4 THEN 1 ELSE 0 END) as fours,
                SUM(CASE WHEN d.runs_scored = 6 THEN 1 ELSE 0 END) as sixes,
                ROUND(SUM(d.runs_scored) / COUNT(d.delivery_id) * 100, 2) as strike_rate
         FROM Deliveries d
         JOIN Users u ON d.batsman_id = u.user_id
         WHERE d.inning_id = ?
         GROUP BY d.batsman_id, u.name`,
        [inning.inning_id]
      );

      // Get bowler stats
      const [bowlers] = await db.execute(
        `SELECT d.bowler_id as player_id, 
                u.name, 
                COUNT(d.delivery_id) / 6 as overs,
                0 as maidens, 
                SUM(d.runs_scored + d.extras) as runs,
                SUM(CASE WHEN d.wicket = 1 THEN 1 ELSE 0 END) as wickets,
                ROUND(SUM(d.runs_scored + d.extras) / (COUNT(d.delivery_id) / 6), 2) as economy
         FROM Deliveries d
         JOIN Users u ON d.bowler_id = u.user_id
         WHERE d.inning_id = ?
         GROUP BY d.bowler_id, u.name`,
        [inning.inning_id]
      );

      const run_rate =
        inning.overs_played > 0
          ? (inning.total_runs / inning.overs_played).toFixed(2)
          : 0;

      result[teamKey] = {
        total: inning.total_runs || 0,
        wickets: inning.total_wickets || 0,
        overs: inning.overs_played || 0,
        run_rate: parseFloat(run_rate),
        players: batsmen || [],
        bowlers: bowlers || [],
      };
    }

    // Ensure both teams have data
    if (!result.team1) {
      result.team1 = {
        total: 0,
        wickets: 0,
        overs: 0,
        run_rate: 0,
        players: [],
        bowlers: [],
      };
    }

    if (!result.team2) {
      result.team2 = {
        total: 0,
        wickets: 0,
        overs: 0,
        run_rate: 0,
        players: [],
        bowlers: [],
      };
    }

    return result;
  } catch (error) {
    console.error("Error getting match score:", error);
    throw error;
  }
};

const getMatchState = async (matchId) => {
  try {
    // Get match details including phase
    const match = await getMatchDetails(matchId);
    if (!match) {
      return null;
    }
    
    // Get innings information
    const [innings] = await db.execute(
      `SELECT inning_id, batting_team_id, bowling_team_id, inning_number 
       FROM Innings 
       WHERE match_id = ? 
       ORDER BY inning_number`,
      [matchId]
    );
    
    // Get selected players
    const [players] = await db.execute(
      `SELECT p11.player_id, tp.team_id
       FROM playing_11 p11
       LEFT JOIN Team_Players tp ON p11.player_id = tp.player_id
       WHERE p11.match_id = ?`,
      [matchId]
    );

    // Group players by team
    const selectedPlayers = {
      team1: [],
      team2: []
    };
    
    players.forEach(player => {
      if (player.team_id === match.team1_id) {
        selectedPlayers.team1.push(player.player_id);
      } else if (player.team_id === match.team2_id) {
        selectedPlayers.team2.push(player.player_id);
      }
    });
    
    // Get completed phases based on current phase
    const phases = ['toss', 'team_selection', 'inning_one', 'inning_two', 'finished'];
    const currentPhaseIndex = phases.indexOf(match.phase || 'toss');
    const completedPhases = phases.slice(0, currentPhaseIndex);
    
    // Prepare innings data
    let inningOneId = null;
    let inningTwoId = null;
    let battingTeamId = null;
    let bowlingTeamId = null;
    
    if (innings.length > 0) {
      inningOneId = innings[0].inning_id;
      battingTeamId = innings[0].batting_team_id;
      bowlingTeamId = innings[0].bowling_team_id;
      
      if (innings.length > 1) {
        inningTwoId = innings[1].inning_id;
      }
    }
    
    // Initialize with default values
    let scoreData = {
      team1: { total: 0, wickets: 0, overs: 0 },
      team2: { total: 0, wickets: 0, overs: 0 }
    };

    try {
      scoreData = await getMatchScore(matchId);
    } catch (scoreError) {
      console.error('Error getting match scores:', scoreError);
    }
    
    return {
      currentPhase: match.phase || 'toss',
      completedPhases,
      inningOneId,
      inningTwoId,
      battingTeamId,
      bowlingTeamId,
      selectedPlayers,
      team1: {
        team_id: match.team1_id,
        team_name: match.team1_name
      },
      team2: {
        team_id: match.team2_id,
        team_name: match.team2_name
      },
      team1Name: match.team1_name,
      team2Name: match.team2_name,
      scores: {
        inningOne: {
          runs: scoreData.team1?.total || 0,
          wickets: scoreData.team1?.wickets || 0,
          overs: scoreData.team1?.overs || 0
        },
        inningTwo: {
          runs: scoreData.team2?.total || 0,
          wickets: scoreData.team2?.wickets || 0,
          overs: scoreData.team2?.overs || 0
        }
      },
      winnerTeamId: match.winner_id
    };
  } catch (error) {
    console.error('Error getting match state:', error);
    throw error;
  }
};

const getApplieddRequestsByTournamentID = async (tournament_id) => {
  try {
    const [rows] = await db.execute(
      `select T.team_name, T.team_id, A.payment_slip, A.created_at
       from Teams T join tournament_applicants A on T.team_id = A.team_id
       where A.status = 'applied' and tournament_id = ?;`,
      [tournament_id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const deleteAppliedRequest = async (tournament_id, team_id) => {
  const [result] = await db.execute(
    `DELETE FROM tournament_applicants WHERE tournament_id = ? AND team_id = ?`,
    [tournament_id, team_id]
  );
  return result;
};

const acceptAppliedRequest = async (tournament_id, team_id) => {
  const [result] = await db.execute(
    `UPDATE tournament_applicants SET status = 'accepted' WHERE tournament_id = ? AND team_id = ?`,
    [tournament_id, team_id]
  );
  return result;
};

// Update database schema - execute only once
const addPhaseColumnToMatches = async () => {
  try {
    const [columns] = await db.execute(
      "SHOW COLUMNS FROM Matches LIKE 'phase'"
    );

    if (columns.length === 0) {
      await db.execute(
        "ALTER TABLE Matches ADD COLUMN phase ENUM('toss', 'team_selection', 'inning_one', 'inning_two', 'finished') DEFAULT 'toss'"
      );
      console.log("Added phase column to Matches table");
    }
  } catch (error) {
    console.error("Error adding phase column:", error);
  }
};

// Call this when the server starts
addPhaseColumnToMatches();

module.exports = {
  createTournament,
  getAllOngoingTournaments,
  getTournamentsByOrganizer,
  getUpcomingTournaments,
  getInningStatsById,
  getMatchPhase,
  saveMatchPhase,
  getMatchDetails,
  getTeamDetails,
  saveMatchResult,
  getMatchScore,
  getMatchState,
  getApplieddRequestsByTournamentID,
  deleteAppliedRequest,
  acceptAppliedRequest
}; 