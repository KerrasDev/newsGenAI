const winston = require('winston');
const path = require('path');

/**
 * Create a logger with multiple transports
 * @param {Object} options - Logger configuration options
 * @returns {winston.Logger} Configured Winston logger
 */
const createLogger = (options = {}) => {
  const defaultOptions = {
    level: process.env.LOG_LEVEL || 'info',
    logDir: path.join(__dirname, '../logs'),
    maxSize: '10m', // 10 megabytes
    maxFiles: '14d' // Keep logs for 14 days
  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Create a Winston logger
  const logger = winston.createLogger({
    level: mergedOptions.level,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports: [
      // Console transport for development
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),

      // File transport for error logs
      new winston.transports.File({
        filename: path.join(mergedOptions.logDir, 'error.log'),
        level: 'error',
        maxsize: mergedOptions.maxSize,
        maxFiles: mergedOptions.maxFiles
      }),

      // File transport for combined logs
      new winston.transports.File({
        filename: path.join(mergedOptions.logDir, 'combined.log'),
        maxsize: mergedOptions.maxSize,
        maxFiles: mergedOptions.maxFiles
      })
    ]
  });

  // If we're not in production, log to console
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

  return logger;
};

/**
 * Middleware to log HTTP requests
 * @param {winston.Logger} logger - Winston logger instance
 * @returns {Function} Express middleware function
 */
const requestLogger = (logger = null) => {
  const log = logger || createLogger();

  return (req, res, next) => {
    const startTime = Date.now();

    // Log the request
    log.info(`Request: ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      ip: req.ip
    });

    // Override res.end to log response
    const oldEnd = res.end;
    res.end = function(chunk, encoding) {
      const duration = Date.now() - startTime;
      
      log.info(`Response: ${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });

      oldEnd.call(this, chunk, encoding);
    };

    next();
  };
};

module.exports = {
  createLogger,
  requestLogger
};
