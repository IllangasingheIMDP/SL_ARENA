import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/authTypes';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  // This effect will handle navigation based on selected role
  useEffect(() => {
    // The AppNavigator will automatically handle navigation based on the selected role
    // No need to manually navigate here
  }, [selectedRole]);

  const checkUser = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
      
      // If user has only one role, automatically select it
      if (userData && userData.role && userData.role.length === 1) {
        setSelectedRole(userData.role[0]);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      
      // If user has only one role, automatically select it
      if (response.user && response.user.role && response.user.role.length === 1) {
        setSelectedRole(response.user.role[0]);
      } else {
        setSelectedRole(null);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      
      // If user has only one role, automatically select it
      if (response.user && response.user.role && response.user.role.length === 1) {
        setSelectedRole(response.user.role[0]);
      } else {
        setSelectedRole(null);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setSelectedRole(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, selectedRole, setSelectedRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 