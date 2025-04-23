// models/userModel.js
const db = require('../config/dbconfig');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/constants');

class UserModel {
  // Create a new user
  static async createUser(userData) {
    try {
      const { email, password, name } = userData;
      
      // Hash password
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      
      const [result] = await db.execute(
        'INSERT INTO Users (email, password_hash, name, role) VALUES (?, ?, ?, ?, ?, ?)',
        [email, password_hash, name, 'general']
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const [rows] = await db.execute('SELECT * FROM Users WHERE user_id = ?', [userId]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, userData) {
    try {
      const { name, phone, date_of_birth, profile_picture } = userData;
      
      let query = 'UPDATE Users SET ';
      const params = [];
      const updates = [];
      
      if (name) {
        updates.push('name = ?');
        params.push(name);
      }
      
      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      
      if (date_of_birth) {
        updates.push('date_of_birth = ?');
        params.push(date_of_birth);
      }
      
      if (profile_picture) {
        updates.push('profile_picture = ?');
        params.push(profile_picture);
      }
      
      if (updates.length === 0) {
        return false; // Nothing to update
      }
      
      query += updates.join(', ') + ' WHERE user_id = ?';
      params.push(userId);
      
      const [result] = await db.execute(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update user role
  static async updateRole(userId, role) {
    try {
      const [result] = await db.execute(
        'UPDATE Users SET role = ? WHERE user_id = ?',
        [role, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update verification status
  static async updateVerificationStatus(userId, status) {
    try {
      const [result] = await db.execute(
        'UPDATE Users SET verification_status = ? WHERE user_id = ?',
        [status, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, newPassword) {
    try {
      const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      
      const [result] = await db.execute(
        'UPDATE Users SET password_hash = ? WHERE user_id = ?',
        [password_hash, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const [result] = await db.execute('DELETE FROM Users WHERE user_id = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Verify password
  static async verifyPassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
