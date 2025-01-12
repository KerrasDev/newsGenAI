const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Token utility class for JWT and refresh token management
 */
class TokenUtils {
  /**
   * Generate an access token
   * @param {Object} payload - Data to encode in the token
   * @param {Object} options - Token generation options
   * @returns {string} Generated JWT token
   */
  static generateAccessToken(payload, options = {}) {
    const defaultOptions = {
      expiresIn: '1h', // Default expiration
      algorithm: 'HS256'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return jwt.sign(
      payload, 
      process.env.JWT_ACCESS_SECRET || 'default_access_secret', 
      mergedOptions
    );
  }

  /**
   * Generate a refresh token
   * @param {Object} payload - Data to encode in the token
   * @param {Object} options - Token generation options
   * @returns {string} Generated refresh token
   */
  static generateRefreshToken(payload, options = {}) {
    const defaultOptions = {
      expiresIn: '7d', // Longer expiration for refresh token
      algorithm: 'HS256'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return jwt.sign(
      payload, 
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', 
      mergedOptions
    );
  }

  /**
   * Verify an access token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(
        token, 
        process.env.JWT_ACCESS_SECRET || 'default_access_secret'
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify a refresh token
   * @param {string} token - Refresh token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(
        token, 
        process.env.JWT_REFRESH_SECRET || 'default_refresh_secret'
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a cryptographically secure random token
   * @param {number} length - Length of the token in bytes
   * @returns {string} Hex-encoded random token
   */
  static generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Create a password reset token
   * @param {string} userId - User ID
   * @returns {Object} Object containing token and expiration
   */
  static createPasswordResetToken(userId) {
    const resetToken = this.generateRandomToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    return {
      token: crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex'),
      expiry: resetTokenExpiry
    };
  }

  /**
   * Decode a token without verification
   * @param {string} token - JWT token to decode
   * @returns {Object|null} Decoded token payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = TokenUtils;
