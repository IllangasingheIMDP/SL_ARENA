import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { LoginCredentials, RegisterData, ApiError, User, AuthResponse } from '../types/authTypes';

class AuthService {
  private async handleResponse(response: any): Promise<any> {
    //console.log('Response:', response.status);
    if (response.status !== 'success') {
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
      
      if (responseData.data) {
        const userData = {
          id: responseData.data.userId ? responseData.data.userId.toString() : '',
          email: responseData.data.email || '',
          name: responseData.data.name || '',
          role: responseData.data.role || [],
        };
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        // Return the response without requiring a token
        return {
          user: userData
        };
      } else {
        console.error('Unexpected response format:', responseData);
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

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.put(
        '/users/change-password',
        { currentPassword, newPassword },
        true
      );
      const responseData = await this.handleResponse(response);
      
      if (responseData.status !== 'success') {
        throw new Error(responseData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
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