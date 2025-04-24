const notificationModel = require('../models/notificationModel');

// Create a notification and emit via WebSocket
const createNotification = (io) => async (req, res) => {
  try {
    const { user_id, message, notification_type } = req.body;
    if (!user_id || !message || !notification_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification = await notificationModel.create(user_id, message, notification_type);
    
    // Emit notification to the specific user via WebSocket
    io.to(`user_${user_id}`).emit('new_notification', notification);
    res.status(201).json(notification);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Get user's notifications
const getNotifications = async (req, res) => {
  try {
    //console.log('Getting notifications for user:', req.user);
    const user_id = req.user.user_id; // From JWT middleware
    //console.log('User ID from token:', user_id);
    
    const notifications = await notificationModel.getByUserId(user_id);
    //console.log('Found notifications:', notifications);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.user_id; // From JWT middleware
    
    const result = await notificationModel.markAsRead(notification_id, user_id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

module.exports = { createNotification, getNotifications, markNotificationAsRead };
