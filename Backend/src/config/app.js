const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const SecurityManager = require('./security');

/**
 * Create and configure an Express application
 * @param {Object} options - Configuration options for the app
 * @returns {express.Application} Configured Express application
 */
const createApp = (options = {}) => {
  const app = express();

  // Default middleware configurations
  const defaultMiddleware = {
    cors: {
      origin: '*', // Customize as needed
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    helmet: {
      // Helmet helps secure Express apps by setting various HTTP headers
      contentSecurityPolicy: false // Customize as needed
    },
    json: {
      limit: '10mb' // Adjust payload size limit
    },
    urlencoded: {
      extended: true,
      limit: '10mb'
    }
  };

  // Merge default and user-provided middleware options
  const middlewareOptions = {
    ...defaultMiddleware,
    ...options.middleware
  };

  // Middleware setup
  app.use(cors(middlewareOptions.cors));
  app.use(helmet(middlewareOptions.helmet));
  app.use(morgan('combined')); // Logging
  app.use(express.json(middlewareOptions.json));
  app.use(express.urlencoded(middlewareOptions.urlencoded));

  // Optional rate limiting
  if (options.enableRateLimiting !== false) {
    const rateLimiter = SecurityManager.createRateLimiter(
      options.rateLimiterOptions
    );
    app.use(rateLimiter);
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
        status: err.status || 500
      }
    });
  });

  // Route registration method
  app.registerRoutes = (routes) => {
    routes.forEach(({ path, router }) => {
      app.use(path, router);
    });
  };

  return app;
};

module.exports = createApp;
