import { api } from '../utils/api';
import {
  PlayerStats,
  PlayerAchievement,
  PlayerProfile,
  TrainingSession,
  PlayerMedia,
  UpdateProfileBioRequest
} from '../types/playerTypes';

const getPlayerStats = async (): Promise<PlayerStats> => {
  const response = await api.get(`/players/stat`);
  //console.log(response.data,'response stats');
  return response.data;
};

const getPlayerAchievements = async (): Promise<PlayerAchievement[]> => {
  const response = await api.get(`/players/achievements`);
  //console.log(response,'response achievements');
  return response.data;
};

const getPlayerProfile = async (): Promise<PlayerProfile> => {
  const response = await api.get(`/players/profiledetails`);
  //console.log(response,'response profile');
  return response.data;
};

const getPlayerMedia = async (): Promise<string[]> => {
  const response = await api.get(`/players/getPlayerMedia`);
  //console.log(response,'response media');
  return response.data;
};

const updateProfileBio = async (bio: string): Promise<void> => {
  await api.put(`/players/updateProfilebio`, { bio });
};

const getTrainingSessions = async (): Promise<TrainingSession[]> => {
  const response = await api.get(`/players/reminders`);
  //console.log(response,'response training');
  return response.data;
};

export const playerService = {
  getPlayerStats,
  getPlayerAchievements,
  getPlayerProfile,
  getPlayerMedia,
  updateProfileBio,
  getTrainingSessions
}; 