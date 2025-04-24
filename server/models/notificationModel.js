const db = require('../config/dbconfig'); // Your MySQL connection from previous setup

const notificationModel = {
  // Create a new notification
  create: async (user_id, message, notification_type) => {
    console.log('Creating notification in database:', { user_id, message, notification_type });
    try {
      const [result] = await db.execute(
        'INSERT INTO Notifications (user_id, message, notification_type, is_read) VALUES (?, ?, ?, ?)',
        [user_id, message, notification_type, 0]
      );
      console.log('Notification created successfully:', result);
      return { notification_id: result.insertId, user_id, message, notification_type, is_read: 0, created_at: new Date() };
    } catch (err) {
      console.error('Database error in create:', err);
      throw err;
    }
  },

  // Get notifications for a user
  getByUserId: async (user_id) => {
    console.log('Fetching notifications from database for user:', user_id);
    try {
      const [results] = await db.execute(
        'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC',
        [user_id]
      );
      console.log('Database query results:', results);
      return results;
    } catch (err) {
      console.error('Database error in getByUserId:', err);
      throw err;
    }
  },

  // Mark notification as read
  markAsRead: async (notification_id, user_id) => {
    console.log('Marking notification as read in database:', { notification_id, user_id });
    try {
      const [result] = await db.execute(
        'UPDATE Notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
        [notification_id, user_id]
      );
      console.log('Notification marked as read:', result);
      return result;
    } catch (err) {
      console.error('Database error in markAsRead:', err);
      throw err;
    }
  }
};

module.exports = notificationModel;