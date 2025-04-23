import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api/v1/users'; // Change this to your actual API URL

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
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any;
}

class AuthService {
  private async handleResponse(response: Response): Promise<any> {
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'An error occurred',
        status: response.status,
        errors: data.errors
      };
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw error;
    }
    
    return data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse(response);
      console.log('Login successful:', { userId: data.user.id });
      
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { 
        email: data.email,
        name: data.name 
      });
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await this.handleResponse(response);
      console.log('Registration successful:', { userId: responseData.user.id });
      
      await AsyncStorage.setItem('token', responseData.token);
      await AsyncStorage.setItem('user', JSON.stringify(responseData.user));
      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('Logging out user');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token retrieved:', token ? 'exists' : 'not found');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getUser(): Promise<any | null> {
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('User data retrieved:', user ? 'exists' : 'not found');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}

export default new AuthService(); 