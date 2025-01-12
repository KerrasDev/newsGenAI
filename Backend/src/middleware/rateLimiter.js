const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

/**
 * Create a rate limiter middleware with configurable options
 * @param {Object} options - Rate limiter configuration
 * @returns {Function} Express rate limiter middleware
 */
const createRateLimiter = (options = {}) => {
  // Default configuration
  const defaultConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests, please try again later',
    
    // Optional Redis store for distributed rate limiting
    useRedis: false,
    redisConfig: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    }
  };

  // Merge default and user-provided options
  const config = { ...defaultConfig, ...options };

  // Configure store
  let store;
  if (config.useRedis) {
    const redisClient = new Redis(config.redisConfig);
    
    store = new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
      prefix: config.redisPrefix || 'rl:'
    });
  }

  // Create rate limiter
  const limiter = rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: config.standardHeaders,
    legacyHeaders: config.legacyHeaders,
    message: config.message,
    ...(store && { store })
  });

  return limiter;
};

/**
 * Middleware to create route-specific rate limiters
 * @param {Object} routeConfig - Configuration for specific routes
 * @returns {Function} Express middleware for route-specific rate limiting
 */
const routeSpecificRateLimiter = (routeConfig = {}) => {
  return (req, res, next) => {
    const defaultRouteConfig = {
      '/auth/login': { windowMs: 5 * 60 * 1000, max: 5 },
      '/auth/register': { windowMs: 15 * 60 * 1000, max: 3 },
      '/api/sensitive': { windowMs: 60 * 60 * 1000, max: 10 }
    };

    const mergedConfig = { ...defaultRouteConfig, ...routeConfig };
    const routePath = req.path;

    const specificConfig = mergedConfig[routePath];
    if (specificConfig) {
      const specificLimiter = createRateLimiter(specificConfig);
      return specificLimiter(req, res, next);
    }

    next();
  };
};

module.exports = {
  createRateLimiter,
  routeSpecificRateLimiter
};
