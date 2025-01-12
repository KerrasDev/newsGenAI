require('dotenv').config();
const createApp = require('./config/app');
const { connectDatabase } = require('./config/database');
const { createLogger, requestLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const templateRoutes = require('./routes/templates');
const projectRoutes = require('./routes/projects');
const newsRoutes = require('./routes/news');

// Create logger
const logger = createLogger();

// Create Express app with configuration
const app = createApp({
  middleware: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  },
  enableRateLimiting: true
});

// Database connection
const connectDB = async () => {
  try {
    await connectDatabase(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/templatedb', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1);
  }
};

// Middleware
app.use(requestLogger(logger));

// Routes
app.registerRoutes([
  { path: '/api/templates', router: templateRoutes },
  { path: '/api/projects', router: projectRoutes },
  { path: '/api/news', router: newsRoutes }
]);

// Global error handler
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, HOST, () => {
    logger.info(`Server running on ${HOST}:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
      process.exit(0);
    });
  });

  return server;
};

// Export for testing or external use
module.exports = {
  app,
  startServer
};

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
