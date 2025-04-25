const db = require('../config/database');
const redis = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour in seconds

const placeModel = {
  // Search places with caching
  searchPlaces: async (query, location, radius) => {
    try {
      const cacheKey = `place_search:${query}:${location?.lat}:${location?.lng}:${radius}`;
      
      // Try to get from cache first
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // If not in cache, fetch from Google Places API
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      if (location) {
        url += `&location=${location.lat},${location.lng}`;
      }
      if (radius) {
        url += `&radius=${radius}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to search places');
      }

      // Cache the results
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data.results));

      return data.results;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  },

  // Get place details with caching
  getPlaceDetails: async (placeId) => {
    try {
      const cacheKey = `place_details:${placeId}`;
      
      // Try to get from cache first
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // If not in cache, fetch from Google Places API
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,rating,types,vicinity,website,phone_number,opening_hours,reviews&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to get place details');
      }

      // Cache the results
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data.result));

      return data.result;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  },

  // Save place to database
  savePlace: async (placeData) => {
    try {
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
      const [result] = await db.execute(
        `DELETE FROM saved_places WHERE place_id = ? AND user_id = ?`,
        [placeId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting saved place:', error);
      throw error;
    }
  },

  // Get nearby places with caching
  getNearbyPlaces: async (location, radius, type) => {
    try {
      const cacheKey = `nearby_places:${location.lat}:${location.lng}:${radius}:${type}`;
      
      // Try to get from cache first
      const cachedResult = await redis.get(cacheKey);
      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      // If not in cache, fetch from Google Places API
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to get nearby places');
      }

      // Cache the results
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data.results));

      return data.results;
    } catch (error) {
      console.error('Error getting nearby places:', error);
      throw error;
    }
  },
};

module.exports = placeModel; 