// middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const UserModel = require('../models/userModel');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required. No token provided.'
      });
    }
    
    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          status: 'error',
          message: 'Invalid or expired token.'
        });
      }
      
      // Check if user exists
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ 
          status: 'error',
          message: 'User not found.'
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Authentication error.',
      error: error.message
    });
  }
};

// Middleware to check specific roles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required.'
      });
    }
    
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  checkRole
};
