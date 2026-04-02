const http = require('http');
const app = require('./app.js');
const env = require('./config/env.js');
const pool = require('./db/pool.js');
const logger = require('./utils/logger.js');
const realtimeService = require('./modules/realtime/realtime.service');

const server = http.createServer(app);

// Initialize WebSocket Sync Engine
realtimeService.init(server);

server.listen(env.port, () => {
  logger.info(`TaskFlow backend listening on port ${env.port}`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await pool.end();
    logger.info('Database pool closed.');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});
