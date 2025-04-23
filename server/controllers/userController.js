// controllers/userController.js
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name, phone, date_of_birth, role } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
    
    // Create user
    const userId = await UserModel.createUser({
      email,
      password,
      name,
    });

    console.log('User created successfully');
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: role || ["general"] },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId,
        email,
        name,
        role: role || ["general"],
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    // // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user.user_id, email: user.email, role: user.role },
    //   JWT_SECRET,
    //   { expiresIn: JWT_EXPIRES_IN }
    // );
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        userId: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};
const chooseRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    //console.log(userId,role,'userId,role');
    const isRoleValid = await UserModel.RoleValidation(userId, role);
    if (!isRoleValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role'
      });
    }
        const token = jwt.sign(
       { user_id: userId, role: role },
       JWT_SECRET,
       { expiresIn: JWT_EXPIRES_IN }
     );

     res.status(200).json({
      status: 'success',
      message: 'Role chosen successfully',
      data: {
        token
      }
     });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to choose role',
      error: error.message
    });
  }
};
// Get current user profile
const getProfile = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;
    
    // Remove sensitive information
    const { password_hash, ...userProfile } = user;
    
    res.status(200).json({
      status: 'success',
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { name, phone, date_of_birth, profile_picture } = req.body;
    
    const updated = await UserModel.updateProfile(userId, {
      name,
      phone,
      date_of_birth,
      profile_picture
    });
    
    if (!updated) {
      return res.status(400).json({
        status: 'error',
        message: 'No changes to update'
      });
    }
    
    // Get updated user data
    const updatedUser = await UserModel.findById(userId);
    const { password_hash, ...userProfile } = updatedUser;
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const isPasswordValid = await UserModel.verifyPassword(req.user, currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    const updated = await UserModel.changePassword(userId, newPassword);
    
    if (!updated) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to change password'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// Update user role (admin only)
const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Validate role
    const validRoles = ['general', 'player', 'organizer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role'
      });
    }
    
    const updated = await UserModel.updateRole(userId, role);
    
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// Update verification status (admin only)
const updateVerificationStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    
    // Validate status
    const validStatuses = ['unverified', 'pending', 'verified'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification status'
      });
    }
    
    const updated = await UserModel.updateVerificationStatus(userId, status);
    
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Verification status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update verification status',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  chooseRole,
  getProfile,
  updateProfile,
  changePassword,
  updateRole,
  updateVerificationStatus
};
