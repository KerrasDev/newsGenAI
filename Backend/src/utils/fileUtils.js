const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

/**
 * File utility class for file-related operations
 */
class FileUtils {
  /**
   * Generate a unique filename
   * @param {string} originalName - Original filename
   * @param {string} prefix - Optional prefix for the filename
   * @returns {string} Unique filename
   */
  static generateUniqueFilename(originalName, prefix = '') {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    
    return `${prefix}${timestamp}-${randomString}${extension}`;
  }

  /**
   * Save file to disk
   * @param {Buffer|string} file - File buffer or path
   * @param {string} destinationPath - Destination path to save the file
   * @param {Object} options - Additional save options
   * @returns {Promise<string>} Path of the saved file
   */
  static async saveFile(file, destinationPath, options = {}) {
    const defaultOptions = {
      overwrite: false,
      createDir: true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      // Create directory if it doesn't exist
      if (mergedOptions.createDir) {
        await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      }

      // Check if file exists and overwrite is false
      if (!mergedOptions.overwrite && await this.fileExists(destinationPath)) {
        throw new Error(`File already exists: ${destinationPath}`);
      }

      // Write file
      await fs.writeFile(destinationPath, file);
      return destinationPath;
    } catch (error) {
      throw new Error(`Error saving file: ${error.message}`);
    }
  }

  /**
   * Read file from disk
   * @param {string} filePath - Path to the file
   * @param {Object} options - Read file options
   * @returns {Promise<Buffer>} File contents
   */
  static async readFile(filePath, options = {}) {
    const defaultOptions = {
      encoding: null, // Return buffer by default
      flag: 'r'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return await fs.readFile(filePath, mergedOptions);
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  /**
   * Delete file from disk
   * @param {string} filePath - Path to the file
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error(`Error deleting file: ${error.message}`);
      }
    }
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to the file
   * @returns {Promise<boolean>} Whether file exists
   */
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} File metadata
   */
  static async getFileMetadata(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
        mimeType: mime.lookup(filePath) || 'application/octet-stream'
      };
    } catch (error) {
      throw new Error(`Error getting file metadata: ${error.message}`);
    }
  }

  /**
   * Sanitize filename
   * @param {string} filename - Original filename
   * @returns {string} Sanitized filename
   */
  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9.]/gi, '_') // Replace invalid characters
      .replace(/_+/g, '_') // Replace multiple underscores
      .toLowerCase();
  }

  /**
   * Create a file stream
   * @param {string} filePath - Path to the file
   * @param {Object} options - Stream options
   * @returns {fs.ReadStream} File read stream
   */
  static createReadStream(filePath, options = {}) {
    return fs.createReadStream(filePath, options);
  }
}

module.exports = FileUtils;
