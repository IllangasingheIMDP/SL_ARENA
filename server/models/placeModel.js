const db = require('../config/dbconfig');
const axios = require('axios');

const placeModel = {
  // Search places
  searchPlaces: async (query, location, radius) => {
    try {
      if (!query) {
        throw new Error('Search query is required');
      }

      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      if (location) {
        url += `&location=${location.lat},${location.lng}`;
      }
      if (radius) {
        url += `&radius=${radius}`;
      }

      const response = await axios.get(url);
      
      if (response.data.status === 'ZERO_RESULTS') {
        return [];
      }
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Failed to search places');
      }

      console.log('Search results:', response.data.results);

      return response.data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    try {
      if (!placeId) {
        throw new Error('Place ID is required');
      }

      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,rating,types,vicinity,website,opening_hours,reviews&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Failed to get place details');
      }

      const placeData = {
        place_id: placeId,
        name: response.data.result.name,
        formatted_address: response.data.result.formatted_address,
      };
      
      return placeData;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  },

  // Get nearby places
  getNearbyPlaces: async (location, radius, type) => {
    try {
      if (!location || !location.lat || !location.lng) {
        throw new Error('Location is required');
      }

      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      if (type) {
        url += `&type=${type}`;
      }

      const response = await axios.get(url);
      
      if (response.data.status === 'ZERO_RESULTS') {
        return [];
      }
      
      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Failed to get nearby places');
      }

      return response.data.results;
    } catch (error) {
      console.error('Error getting nearby places:', error);
      throw error;
    }
  },

  // Save place to database
  savePlace: async (placeData) => {
    try {
      if (!placeData.place_id || !placeData.user_id) {
        throw new Error('Place ID and user ID are required');
      }

      const [result] = await db.execute(
        `INSERT INTO saved_places (
          place_id, name, formatted_address, latitude, longitude,
          photo_reference, rating, types, vicinity, website,
          phone_number, opening_hours, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          placeData.place_id,
          placeData.name,
          placeData.formatted_address,
          placeData.geometry.location.lat,
          placeData.geometry.location.lng,
          placeData.photos?.[0]?.photo_reference,
          placeData.rating,
          JSON.stringify(placeData.types),
          placeData.vicinity,
          placeData.website,
          placeData.phone_number,
          JSON.stringify(placeData.opening_hours),
          placeData.user_id
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error saving place:', error);
      throw error;
    }
  },

  // Get user's saved places
  getSavedPlaces: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const [rows] = await db.execute(
        `SELECT * FROM saved_places WHERE user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting saved places:', error);
      throw error;
    }
  },

  // Delete saved place
  deleteSavedPlace: async (placeId, userId) => {
    try {
      if (!placeId || !userId) {
        throw new Error('Place ID and user ID are required');
      }

      const [result] = await db.execute(
        `DELETE FROM saved_places WHERE place_id = ? AND user_id = ?`,
        [placeId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting saved place:', error);
      throw error;
    }
  }
};

module.exports = placeModel; 