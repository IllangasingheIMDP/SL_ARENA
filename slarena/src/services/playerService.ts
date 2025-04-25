import { api } from '../utils/api';
import {
  PlayerStats,
  PlayerAchievement,
  PlayerProfile,
  TrainingSession,
  Video,
  UpdateProfileBioRequest
} from '../types/playerTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

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
  //console.log(response,'response profile');
  return response.data;
};

const getPlayerVideos = async (userId: string): Promise<string[]> => {
  
  const response = await api.get(`/players/getPlayerVideos/${userId}`);
  //console.log(response,'response media');
  return response.data;
};

const getPlayerPhotos = async (userId: string): Promise<any[]> => {
  const response = await api.get(`/players/getPlayerPhotos/${userId}`);
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

const uploadPhoto = async (formData: FormData): Promise<void> => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/players/uploadPhoto`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }
  return response.json();
};

const uploadPhotoForMatch = async (formData: FormData): Promise<void> => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/players/uploadPhotoForMatch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload photo for match');
  }
  return response.json();
};

const uploadVideo = async (data: { title: string; description: string; videoUrl: string }): Promise<void> => {
  await api.post(`/players/uploadVideo`, data);
};

const uploadVideoForMatch = async (data: { match_id: string; title: string; description: string; videoUrl: string }): Promise<void> => {
  await api.post(`/players/uploadVideoForMatch`, data);
};

const deletePhoto = async (photoId: string): Promise<void> => {
  await api.delete(`/players/deletePhoto/${photoId}`);
};

const deleteVideo = async (videoId: string): Promise<void> => {
  await api.delete(`/players/deleteVideo/${videoId}`);
};

const getAllPlayers = async (): Promise<any[]> => {
  const response = await api.get(`/players/allplayers`);
  console.log(response.data,'response all players');
  return response.data;
};

const getPublicPlayerProfile = async (playerId: string): Promise<PlayerProfile> => {
  const response = await api.get(`/players/publicplayers/${playerId}`);
  return response.data;
};

export const playerService = {
  getPlayerStats,
  getPlayerAchievements,
  getPlayerProfile,
  getPlayerVideos,
  getPlayerPhotos,
  updateProfileBio,
  getTrainingSessions,
  uploadPhoto,
  uploadPhotoForMatch,
  uploadVideo,
  uploadVideoForMatch,
  deletePhoto,
  deleteVideo,
  getAllPlayers,
  getPublicPlayerProfile
}; 