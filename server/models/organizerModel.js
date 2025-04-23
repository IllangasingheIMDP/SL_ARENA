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


module.exports = {
    createTournament,
    getTournamentsByOrganizer
};
