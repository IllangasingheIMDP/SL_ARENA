// middleware/validation.js
const { PASSWORD_REGEX, EMAIL_REGEX } = require('../config/constants');

// Validate registration data
const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];
  
  // Check required fields
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!name) errors.push('Name is required');
  
  // Validate email format
  if (email && !EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }
  
  // Validate password strength
  if (password && !PASSWORD_REGEX.test(password)) {
    errors.push('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validate profile update data
const validateProfileUpdate = (req, res, next) => {
  const { name, phone, date_of_birth } = req.body;
  const errors = [];
  
  // Validate phone format if provided
  if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Validate date of birth if provided
  if (date_of_birth) {
    const dobDate = new Date(date_of_birth);
    const today = new Date();
    
    if (isNaN(dobDate.getTime())) {
      errors.push('Invalid date format for date of birth');
    } else if (dobDate > today) {
      errors.push('Date of birth cannot be in the future');
    }
    
    // Calculate age
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      // Not yet had birthday this year
      if (age - 1 < 13) {
        errors.push('User must be at least 13 years old');
      }
    } else if (age < 13) {
      errors.push('User must be at least 13 years old');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validate password change
const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];
  
  if (!currentPassword) errors.push('Current password is required');
  if (!newPassword) errors.push('New password is required');
  
  if (newPassword && !PASSWORD_REGEX.test(newPassword)) {
    errors.push('New password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number');
  }
  
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('New password must be different from current password');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
};
