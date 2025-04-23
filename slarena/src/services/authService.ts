import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    verification_status?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any;
}

class AuthService {
  private async handleResponse(response: any): Promise<any> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.message || 'An error occurred',
        status: response.status,
        errors: response.errors
      };
      console.error('API Error:', error);
      throw error;
    }
    return response;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/login', credentials, false);
      const responseData = await this.handleResponse(response);
      
      if (responseData.data && responseData.data.token) {
        const userData = {
          id: responseData.data.userId.toString(),
          email: responseData.data.email,
          name: responseData.data.name,
          role: responseData.data.role,
          verification_status: responseData.data.verification_status
        };
        
        await AsyncStorage.setItem('token', responseData.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        return {
          token: responseData.data.token,
          user: userData
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/register', data, false);
      const responseData = await this.handleResponse(response);
      
      if (responseData.data && responseData.data.token) {
        const userData = {
          id: responseData.data.userId.toString(),
          email: responseData.data.email,
          name: responseData.data.name,
          role: responseData.data.role,
          verification_status: responseData.data.verification_status
        };
        
        await AsyncStorage.setItem('token', responseData.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        return {
          token: responseData.data.token,
          user: userData
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getUser(): Promise<any | null> {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}

export default new AuthService(); 