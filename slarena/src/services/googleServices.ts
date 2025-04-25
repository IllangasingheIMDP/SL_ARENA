import Constants from 'expo-constants';
import { Place, PlaceDetails } from '../types/placeTypes';
import { api } from '../utils/api';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

export const googleServices = {
  // Search for places based on query
  searchPlaces: async (query: string, location?: { lat: number; lng: number }, radius?: number): Promise<Place[]> => {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (location) {
        params.append('lat', location.lat.toString());
        params.append('lng', location.lng.toString());
      }
      if (radius) {
        params.append('radius', radius.toString());
      }

      const response = await api.get(`/places/search?${params.toString()}`);

      return response.data;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  },

  // Get place details by place_id
  getPlaceDetails: async (placeId: string): Promise<PlaceDetails> => {
    try {
      const response = await api.get(`/places/details/${placeId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  },

  // Get nearby places based on location and type
  getNearbyPlaces: async (
    location: { lat: number; lng: number },
    radius: number,
    type?: string
  ): Promise<Place[]> => {
    try {
      const params = new URLSearchParams();
      params.append('lat', location.lat.toString());
      params.append('lng', location.lng.toString());
      params.append('radius', radius.toString());
      if (type) {
        params.append('type', type);
      }

      const response = await api.get(`/places/nearby?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting nearby places:', error);
      throw error;
    }
  },

  // Save place to user's favorites
  savePlace: async (placeData: PlaceDetails): Promise<number> => {
    try {
      const response = await api.post('/places/save', placeData);
      return response.data.data.placeId;
    } catch (error) {
      console.error('Error saving place:', error);
      throw error;
    }
  },

  // Get user's saved places
  getSavedPlaces: async (): Promise<Place[]> => {
    try {
      const response = await api.get('/places/saved');
      return response.data.data;
    } catch (error) {
      console.error('Error getting saved places:', error);
      throw error;
    }
  },

  // Delete saved place
  deleteSavedPlace: async (placeId: string): Promise<void> => {
    try {
      await api.delete(`/places/saved/${placeId}`);
    } catch (error) {
      console.error('Error deleting saved place:', error);
      throw error;
    }
  },

  // Get place photo URL (still using Google API directly as it's just a URL)
  getPlacePhotoUrl: (photoReference: string, maxWidth: number = 400): string => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
  },

  // Get place autocomplete suggestions
  getPlaceAutocomplete: async (input: string, location?: { lat: number; lng: number }): Promise<Place[]> => {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${GOOGLE_MAPS_API_KEY}`;

      if (location) {
        url += `&location=${location.lat},${location.lng}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(data.error_message || 'Failed to get autocomplete suggestions');
      }

      // Get details for each place in the autocomplete results
      const places = await Promise.all(
        data.predictions.map(async (prediction: any) => {
          const details = await googleServices.getPlaceDetails(prediction.place_id);
          return details;
        })
      );

      return places;
    } catch (error) {
      console.error('Error getting place autocomplete:', error);
      throw error;
    }
  },


}; 