const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

/**
 * Security utility functions for authentication and rate limiting
 */
class SecurityManager {
  /**
   * Generate a JWT token for a user
   * @param {Object} payload - User data to encode in the token
   * @param {Object} options - JWT signing options
   * @returns {string} Generated JWT token
   */
  static generateToken(payload, options = {}) {
    const defaultOptions = {
      expiresIn: '1d',
      algorithm: 'HS256'
    };

    return jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'default_secret', 
      { ...defaultOptions, ...options }
    );
  }

  /**
   * Verify a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Create a rate limiter middleware
   * @param {Object} options - Rate limiting configuration
   * @returns {Function} Express middleware for rate limiting
   */
  static createRateLimiter(options = {}) {
    const defaultOptions = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests, please try again later',
      standardHeaders: true,
      legacyHeaders: false
    };

    return rateLimit({
      ...defaultOptions,
      ...options
    });
  }

  /**
   * Hash a password (placeholder - replace with proper hashing)
   * @param {string} password - Plain text password
   * @returns {string} Hashed password
   */
  static hashPassword(password) {
    // TODO: Implement proper password hashing (e.g., bcrypt)
    return password; // Placeholder
  }

  /**
   * Compare a plain text password with a hashed password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password to compare against
   * @returns {boolean} Whether passwords match
   */
  static comparePassword(plainPassword, hashedPassword) {
    // TODO: Implement proper password comparison
    return plainPassword === hashedPassword; // Placeholder
  }
}

module.exports = SecurityManager;
