import axios from 'axios';
import { BACKEND_URL } from '@env';

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // For cookies if your backend uses them (e.g., JWT)
});

export const signup = (data: { email: string; password: string; name: string }) =>
  api.post('/users/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/users/login', data);

export default api;