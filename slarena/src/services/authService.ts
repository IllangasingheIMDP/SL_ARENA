import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://slarena-production.up.railway.app/api/v1/users'; // Change this to your actual API URL

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
      const registerUrl = `${API_URL}/register`;
      console.log('Registration Request:', {
        url: registerUrl,
        data: { ...data, password: '[REDACTED]' }
      });
      
      // Test the API connection first
      try {
        const testResponse = await fetch(API_URL, { 
          method: 'HEAD',
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log('API Connection Test:', {
          status: testResponse.status,
          ok: testResponse.ok,
          url: API_URL
        });
      } catch (error) {
        console.error('API Connection Test Failed:', error);
        throw new Error('Cannot connect to the server. Please check your internet connection.');
      }

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      console.log('Registration Response Status:', response.status);
      const responseData = await this.handleResponse(response);
      console.log('Registration Response Data:', responseData);
      
      // Handle the actual response structure
      if (responseData.data && responseData.data.token) {
        await AsyncStorage.setItem('token', responseData.data.token);
        await AsyncStorage.setItem('user', JSON.stringify({
          id: responseData.data.userId,
          email: responseData.data.email,
          name: responseData.data.name,
          role: responseData.data.role
        }));
        return {
          token: responseData.data.token,
          user: {
            id: responseData.data.userId,
            email: responseData.data.email,
            name: responseData.data.name,
            role: responseData.data.role
          }
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: error instanceof Error ? error.constructor.name : typeof error
      });
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