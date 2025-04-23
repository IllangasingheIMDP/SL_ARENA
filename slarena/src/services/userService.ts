import { api } from '../utils/api';

interface ChooseRoleResponse {
  status: string;
  message: string;
  data?: {
    token: string;
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
}

export default new UserService(); 