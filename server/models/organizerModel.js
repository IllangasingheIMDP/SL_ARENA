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

module.exports = {
    createTournament,
    getTournamentsByOrganizer,
    getAppliedTeamsToOngoingTournamentsByOrganizer,
    updateApplicantStatus,
    getAcceptedTeamsByTournament
};
