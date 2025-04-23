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

module.exports = {
    createTournament,
    getTournamentsByOrganizer
};
