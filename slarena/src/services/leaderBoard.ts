import { API_URL } from '../config';
import { api } from '../utils/api';

export const fetchLeaderboard = async (role: string) => {
  try {
    const response = await api.get(`/users/players-leaderboard/${role}`);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerDetails = async (playerId: string) => {
  try {
    const response = await api.get(`/players/publicplayers/${playerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
