const OrganizerModel = require('../models/organizerModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const createTournament = async (req, res) => {
    try {
        const userId = req.user.user_id; // organizer_id
        
        const {
            tournament_name,
            start_date,
            end_date,
            tournament_type,
            rules
        } = req.body;

        if (!tournament_name) {
            return res.status(400).json({ message: 'Tournament name is required' });
        }

        const newTournamentId = await OrganizerModel.createTournament({
            organizer_id: userId,
            tournament_name,
            start_date,
            end_date,
            tournament_type,
            rules
        });

        res.status(201).json({
            message: 'Tournament created successfully',
            tournament_id: newTournamentId
        });
    } catch (err) {
        console.error('Error creating tournament:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTournamentsByOrganizer = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const tournaments = await OrganizerModel.getTournamentsByOrganizer(userId);

        res.status(200).json({
            message: 'Tournaments fetched successfully',
            data: tournaments
        });
    } catch (err) {
        console.error('Error fetching tournaments:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAppliedTeamsToOngoingTournaments = async (req, res) => {
    try {
        const userId = req.user.user_id;
       

        const teams = await OrganizerModel.getAppliedTeamsToOngoingTournamentsByOrganizer(userId);

        res.status(200).json({
            message: 'Applied teams to ongoing tournaments fetched successfully',
            data: teams
        });
    } catch (err) {
        console.error('Error fetching applied teams:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const acceptTournamentApplicant = async (req, res) => {
    try {
        const { id } = req.body;
        await OrganizerModel.updateApplicantStatus(id, 'accepted');

        res.status(200).json({ message: 'Applicant accepted successfully' });
    } catch (err) {
        console.error('Error accepting applicant:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const rejectTournamentApplicant = async (req, res) => {
    try {
        const { id } = req.body;
        await OrganizerModel.updateApplicantStatus(id, 'rejected');

        res.status(200).json({ message: 'Applicant rejected successfully' });
    } catch (err) {
        console.error('Error rejecting applicant:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAcceptedTeamsByTournament = async (req, res) => {
    try {
        const { tournament_id } = req.body;

        if (!tournament_id) {
            return res.status(400).json({ message: 'tournament_id is required' });
        }

        const teams = await OrganizerModel.getAcceptedTeamsByTournament(tournament_id);

        res.status(200).json({
            message: 'Accepted teams fetched successfully',
            data: teams
        });
    } catch (err) {
        console.error('Error fetching accepted teams:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getPlayersWithStats = async (req, res) => {
    try {
        const { team_id } = req.body;

        if (!team_id) {
            return res.status(400).json({ message: 'team_id is required' });
        }

        const players = await OrganizerModel.getPlayersWithStatsByTeam(team_id);

        res.status(200).json({
            message: 'Players fetched successfully',
            data: players
        });
    } catch (err) {
        console.error('Error fetching players:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTeamsNotApplied = async (req, res) => {
    try {
        const { tournament_id } = req.body;

        if (!tournament_id) {
            return res.status(400).json({ message: "tournament_id is required" });
        }

        const teams = await OrganizerModel.getTeamsNotAppliedToTournament(tournament_id);

        res.status(200).json({
            message: 'Teams not applied to this tournament',
            data: teams
        });

    } catch (err) {
        console.error("Error fetching teams not applied:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const sendTournamentInvite = async (req, res) => {
    try {
        const { tournament_id, team_id } = req.body;

        if (!tournament_id || !team_id) {
            return res.status(400).json({ message: "tournament_id and team_id are required" });
        }

        const insertId = await OrganizerModel.createTournamentInvite(tournament_id, team_id);

        res.status(201).json({
            message: 'Invite sent successfully',
            invite_id: insertId
        });

    } catch (err) {
        console.error("Error sending invite:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const addInning = async (req, res) => {
    const { match_id, batting_team_id, bowling_team_id } = req.body;

    if (!match_id || !batting_team_id || !bowling_team_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await OrganizerModel.createInning(match_id, batting_team_id, bowling_team_id);
        res.status(201).json({ message: 'Inning added successfully', inning_id: result.insertId });
    } catch (error) {
        console.error('Error creating inning:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const addDelivery = async (req, res) => {
    try {
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
        } = req.body;

        const result = await OrganizerModel.insertDelivery({
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
        });

        res.status(201).json({ message: 'Delivery inserted successfully', insertId: result.insertId });
    } catch (error) {
        console.error('Error inserting delivery:', error);
        res.status(500).json({ error: 'Error inserting delivery' });
    }
};




module.exports = {
    createTournament,
    getTournamentsByOrganizer,
    getAppliedTeamsToOngoingTournaments,
    acceptTournamentApplicant,
    rejectTournamentApplicant,
    getAcceptedTeamsByTournament,
    getPlayersWithStats,
    getTeamsNotApplied,
    sendTournamentInvite,
    addInning,
    addDelivery
};
