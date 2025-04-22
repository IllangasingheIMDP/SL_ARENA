// config/constants.js
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: '24h',
  SALT_ROUNDS: 10,
  VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  DEFAULT_PAGE_SIZE: 10,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
