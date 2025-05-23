import { api } from '../utils/api';
import { FeedResponse } from '../types/feedTypes';

interface ChooseRoleResponse {
  status: string;
  message: string;
  data?: {
    token: string;
  };
}

interface UpdateProfileData {
  name: string;
}

interface UpdateProfileResponse {
  status: string;
  message: string;
  data?: {
    name: string;
  };
}

class UserService {
  async chooseRole(userId: string, role: string): Promise<ChooseRoleResponse> {
    try {
      const response = await api.post('/users/choose-role', {
        userId,
        role
      }, false);
      
      return response;
    } catch (error) {
      console.error('Error choosing role:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UpdateProfileResponse> {
    try {
      const response = await api.put(`/users/profile`, data, true);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async submitRoleRequest(role: string, formData: any): Promise<any> {
    try {
      const response = await api.post('/users/role-request', {
        role,
        formData
      }, true);
      return response;
    } catch (error) {
      console.error('Error submitting role request:', error);
      throw error;
    }
  }

  async getFeed(page: number = 1, limit: number = 50): Promise<FeedResponse> {
    try {
      const response = await api.get(`/feed/getfeed?page=${page}&limit=${limit}`, true);
      return response;
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }
}

export default new UserService(); 