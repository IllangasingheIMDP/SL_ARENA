const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { authenticateToken } = require('../middleware/auth');

// Search places
router.get('/search', authenticateToken, placeController.searchPlaces);

// Get place details
router.get('/details/:placeId', authenticateToken, placeController.getPlaceDetails);

// Save place
router.post('/save', authenticateToken, placeController.savePlace);

// Get saved places
router.get('/saved', authenticateToken, placeController.getSavedPlaces);

// Delete saved place
router.delete('/saved/:placeId', authenticateToken, placeController.deleteSavedPlace);

// Get nearby places
router.get('/nearby', authenticateToken, placeController.getNearbyPlaces);

module.exports = router; 