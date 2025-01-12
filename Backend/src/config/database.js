const mongoose = require('mongoose');

/**
 * Connects to the database using the provided connection URI
 * @param {string} connectionUri - Database connection URI
 * @param {Object} options - Additional connection options
 * @returns {Promise} - Resolves when connection is established
 */
const connectDatabase = async (connectionUri, options = {}) => {
  const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add more default options as needed
  };

  try {
    const connection = await mongoose.connect(connectionUri, {
      ...defaultOptions,
      ...options
    });

    console.log(`Database connected successfully to ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDatabase
};
