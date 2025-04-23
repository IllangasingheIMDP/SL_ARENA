import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

const getHeaders = async (includeAuth: boolean = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  get: async (endpoint: string, includeAuth: boolean = true) => {
    const headers = await getHeaders(includeAuth);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
    });
    return response.json();
  },

  post: async (endpoint: string, data: any, includeAuth: boolean = true) => {
    const headers = await getHeaders(includeAuth);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (endpoint: string, data: any, includeAuth: boolean = true) => {
    const headers = await getHeaders(includeAuth);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (endpoint: string, includeAuth: boolean = true) => {
    const headers = await getHeaders(includeAuth);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return response.json();
  },
};
