const notificationModel = require('../models/notificationModel');

// Create a notification and emit via WebSocket
const createNotification = (io) => async (req, res) => {
  try {
    const { user_id, message, notification_type } = req.body;
    if (!user_id || !message || !notification_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating notification for user:', user_id);
    const notification = await notificationModel.create(user_id, message, notification_type);
    console.log('Notification created:', notification);
    
    // Get updated unread count
    const notifications = await notificationModel.getByUserId(user_id);
    const unreadCount = notifications.filter(n => n.is_read === 0).length;
    console.log('Current unread count:', unreadCount);
    
    // Emit notification and count to the specific user via WebSocket
    const room = `user_${user_id}`;
    console.log('Emitting to room:', room);
    
    io.to(room).emit('new_notification', notification);
    console.log('Emitted new_notification event');
    
    io.to(room).emit('notification_count_update', unreadCount);
    console.log('Emitted notification_count_update event');
    
    res.status(201).json(notification);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Get user's notifications
const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.user_id; // From JWT middleware
    console.log('Fetching notifications for user:', user_id);
    
    const notifications = await notificationModel.getByUserId(user_id);
    console.log('Found notifications:', notifications);
    
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
const markNotificationAsRead = (io) => async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.user_id; // From JWT middleware
    
    console.log('Marking notification as read:', { notification_id, user_id });
    const result = await notificationModel.markAsRead(notification_id, user_id);
    
    if (result.affectedRows === 0) {
      console.log('Notification not found or unauthorized');
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }

    // Get updated unread count
    const notifications = await notificationModel.getByUserId(user_id);
    const unreadCount = notifications.filter(n => n.is_read === 0).length;
    console.log('Updated unread count:', unreadCount);
    
    // Emit updated count
    const room = `user_${user_id}`;
    io.to(room).emit('notification_count_update', unreadCount);
    console.log('Emitted notification_count_update event to room:', room);
    
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

module.exports = { createNotification, getNotifications, markNotificationAsRead };
