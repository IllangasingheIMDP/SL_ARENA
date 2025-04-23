export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Array<string>;
}

export interface AuthResponse {
  token?: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: any;
} 