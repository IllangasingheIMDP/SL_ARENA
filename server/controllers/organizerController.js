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

const getTournamentsByOrganizerController = async (req, res) => {
    try {
        //const userId = req.user.user_id;
        const userId=1;
        const rows = await OrganizerModel.getTournamentsByOrganizer(userId);

        const tournaments = rows.map(row => ({
            tournament: {
                tournament_id: row.tournament_id,
                tournament_name: row.tournament_name,
                start_date: row.start_date,
                end_date: row.end_date,
                tournament_type: row.tournament_type,
                rules: row.rules,
                status: row.status,
                venue_id: row.venue_id,
            },
            organizer: {
                organizer_id: row.organizer_id,
                name: row.organizer_name,
                email: row.organizer_email
            },
            venue: {
                venue_id: row.venue_id,
                venue_name: row.venue_name,
                address: row.address,
                city: row.city,
                state: row.state,
                country: row.country,
                latitude: row.latitude,
                longitude: row.longitude,
                capacity: row.capacity
            }
        }));

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


const getCurrentBatsmenRuns = async (req, res) => {
    try {
        const { inning_id } = req.body;

        const batsmen = await OrganizerModel.getCurrentBatsmenRuns(inning_id);

        res.status(200).json({ batsmen });
    } catch (error) {
        console.error('Error fetching current batsmen runs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getNextBallController = async (req, res) => {
    try {
        const { inning_id } = req.body;
        const nextBall = await OrganizerModel.getNextBall(inning_id);
        res.json(nextBall);
    } catch (error) {
        console.error('Error fetching next ball:', error);
        res.status(500).json({ message: 'Error fetching next ball' });
    }
};

const updateInningSummary = async (req, res) => {
    const { inning_id } = req.body;
  
    try {
      const result = await OrganizerModel.updateInningSummary(inning_id);
      res.status(200).json({ message: 'Inning updated successfully', result });
    } catch (error) {
      console.error('Error updating inning:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const updatePlayerStats = async (req, res) => {
    const { match_id } = req.body;
  
    try {
      const result = await OrganizerModel.updatePlayerStats(match_id);
      res.status(200).json({ message: 'Player stats updated', result });
    } catch (error) {
      console.error('Error updating player stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  





module.exports = {
    createTournament,
    getTournamentsByOrganizerController,
    getAppliedTeamsToOngoingTournaments,
    acceptTournamentApplicant,
    rejectTournamentApplicant,
    getAcceptedTeamsByTournament,
    getPlayersWithStats,
    getTeamsNotApplied,
    sendTournamentInvite,
    addInning,
    addDelivery,
    getCurrentBatsmenRuns,
    getNextBallController,
    updateInningSummary,
    updatePlayerStats
};
