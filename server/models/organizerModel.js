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
        `SELECT * FROM Tournaments 
         WHERE organizer_id = ? AND status = 'ongoing' 
         ORDER BY start_date DESC`,
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


module.exports = {
    createTournament,
    getTournamentsByOrganizer,
    getAppliedTeamsToOngoingTournamentsByOrganizer,
    updateApplicantStatus,
    getAcceptedTeamsByTournament,
    getPlayersWithStatsByTeam,
    getTeamsNotAppliedToTournament
};
