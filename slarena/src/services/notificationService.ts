import { api } from '../utils/api';

export interface Notification {
  notification_id: number;
  message: string;
  notification_type: string;
  is_read: number;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications');
      //console.log('response in getNotifications', response);
      // Handle both response formats (with or without data property)
      const notifications = Array.isArray(response) ? response : (response.data || []);
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`, {});
      //console.log('response in markAsRead', response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications');
      //console.log('response in getUnreadCount', response);
      // Handle both response formats (with or without data property)
      const notifications = Array.isArray(response) ? response : (response.data || []);
      if (!Array.isArray(notifications)) {
        console.warn('Invalid notification data received:', notifications);
        return 0;
      }
      return notifications.filter(n => n.is_read === 0).length;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }
}; 