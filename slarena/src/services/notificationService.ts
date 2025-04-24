import { api } from '../utils/api';

export interface Notification {
  notification_id: number;
  message: string;
  notification_type: string;
  is_read: number;
  created_at: string;
}

export interface CreateNotificationPayload {
  user_id: number;
  message: string;
  notification_type: string;
}

export interface CreateBulkNotificationPayload {
  userIds: number[];
  message: string;
  notification_type: string;
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
  },

  createNotification: async (payload: CreateNotificationPayload): Promise<Notification> => {
    try {
      const response = await api.post('/notifications', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  createBulkNotification: async (payload: CreateBulkNotificationPayload): Promise<{ message: string; affectedRows: number }> => {
    try {
      const response = await api.post('/notifications/bulk', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }
}; 