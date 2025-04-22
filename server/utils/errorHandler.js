// utils/errorHandler.js

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Global error handling middleware
   */
  const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let errors = err.errors || [];
    
    // Handle specific error types
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token. Please log in again';
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired. Please log in again';
    } else if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 409;
      message = 'Duplicate entry';
    } else if (err.code === 'ER_NO_REFERENCED_ROW') {
      statusCode = 400;
      message = 'Referenced record does not exist';
    }
    
    // Log error for server-side issues
    if (statusCode >= 500) {
      console.error(`[${new Date().toISOString()}] Server Error:`, err);
    }
    
    // Send response
    res.status(statusCode).json({
      status: 'error',
      message,
      errors: errors.length > 0 ? errors : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  /**
   * Catch async errors in route handlers
   */
  const catchAsync = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  module.exports = {
    ApiError,
    errorHandler,
    catchAsync
  };