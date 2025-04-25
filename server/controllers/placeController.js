const placeModel = require('../models/placeModel');

const placeController = {
  // Search places
  searchPlaces: async (req, res) => {
    try {
      const { query, lat, lng, radius } = req.query;
      const results = await placeModel.searchPlaces(
        query,
        lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
        radius ? parseInt(radius) : null
      );
      res.status(200).json({
        message: 'Places found successfully',
        data: results
      });
    } catch (error) {
      console.error('Error in searchPlaces controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get place details
  getPlaceDetails: async (req, res) => {
    try {
      const { placeId } = req.params;
      const details = await placeModel.getPlaceDetails(placeId);
      res.status(200).json({
        message: 'Place details fetched successfully',
        data: details
      });
    } catch (error) {
      console.error('Error in getPlaceDetails controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Save place
  savePlace: async (req, res) => {
    try {
      const placeData = {
        ...req.body,
        user_id: req.user.user_id
      };
      const placeId = await placeModel.savePlace(placeData);
      res.status(201).json({
        message: 'Place saved successfully',
        data: { placeId }
      });
    } catch (error) {
      console.error('Error in savePlace controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get saved places
  getSavedPlaces: async (req, res) => {
    try {
      const places = await placeModel.getSavedPlaces(req.user.user_id);
      res.status(200).json({
        message: 'Saved places fetched successfully',
        data: places
      });
    } catch (error) {
      console.error('Error in getSavedPlaces controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete saved place
  deleteSavedPlace: async (req, res) => {
    try {
      const { placeId } = req.params;
      const success = await placeModel.deleteSavedPlace(placeId, req.user.user_id);
      if (success) {
        res.status(200).json({
          message: 'Place deleted successfully'
        });
      } else {
        res.status(404).json({
          message: 'Place not found'
        });
      }
    } catch (error) {
      console.error('Error in deleteSavedPlace controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get nearby places
  getNearbyPlaces: async (req, res) => {
    try {
      const { lat, lng, radius, type } = req.query;
      const places = await placeModel.getNearbyPlaces(
        { lat: parseFloat(lat), lng: parseFloat(lng) },
        parseInt(radius),
        type
      );
      res.status(200).json({
        message: 'Nearby places fetched successfully',
        data: places
      });
    } catch (error) {
      console.error('Error in getNearbyPlaces controller:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = placeController; 