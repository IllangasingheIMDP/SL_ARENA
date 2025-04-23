import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import Config from 'react-native-config';

// Define user roles
export enum UserRole {
  GENERAL_USER = 'GeneralUser',
  PLAYER = 'Player',
  ORGANIZER = 'Organizer',
  ADMIN = 'Admin',
}

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define auth response interface
export interface AuthResponse {
  user: User;
  token: string;
}

// Define login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Define registration data interface
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  role: UserRole;
}

// API base URL
const API_URL = Config.API_URL || 'http://localhost:5000/api';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

class AuthService {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { user, token } = response.data;
      
      // Store token and user data
      await this.setAuthData(token, user);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Register a new user
  async register(data: RegistrationData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const { user, token } = response.data;
      
      // Store token and user data
      await this.setAuthData(token, user);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login with Google
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Get Google user data
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Send Google token to backend
      const response = await axios.post(`${API_URL}/auth/google`, {
        token: userInfo.idToken,
      });
      
      const { user, token } = response.data;
      
      // Store token and user data
      await this.setAuthData(token, user);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login with Facebook
  async loginWithFacebook(): Promise<AuthResponse> {
    try {
      // Get Facebook user data
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      
      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        throw new Error('Something went wrong obtaining the access token');
      }
      
      // Send Facebook token to backend
      const response = await axios.post(`${API_URL}/auth/facebook`, {
        token: data.accessToken,
      });
      
      const { user, token } = response.data;
      
      // Store token and user data
      await this.setAuthData(token, user);
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear stored data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      // Sign out from Google if signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      
      // Sign out from Facebook if signed in
      await LoginManager.logOut();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get auth token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await axios.put(
        `${API_URL}/users/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const updatedUser = response.data;
      
      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request role upgrade
  async requestRoleUpgrade(userId: string, newRole: UserRole): Promise<void> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      await axios.post(
        `${API_URL}/users/${userId}/role-upgrade`,
        { newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify user identity
  async verifyIdentity(userId: string, verificationData: any): Promise<void> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      await axios.post(
        `${API_URL}/users/${userId}/verify`,
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to store auth data
  private async setAuthData(token: string, user: User): Promise<void> {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  // Helper method to handle errors
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with an error
      return new Error(error.response.data.message || 'Server error');
    } else if (error.request) {
      // Request was made but no response
      return new Error('Network error');
    } else {
      // Something else happened
      return new Error(error.message || 'Unknown error');
    }
  }
}

export default new AuthService(); 