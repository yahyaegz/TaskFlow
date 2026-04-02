const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const logger = require('../../utils/logger');

class RealtimeService {
  constructor() {
    this.io = null;
  }

  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: env.corsOrigin ? env.corsOrigin.split(',') : 'http://localhost:5173',
        credentials: true,
      },
    });

    // Authentication Middleware for Socket.io
    this.io.use((socket, next) => {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) return next(new Error('Authentication error'));

      const token = cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) return next(new Error('Authentication error'));

      try {
        const decoded = jwt.verify(token, env.jwtSecret);
        socket.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.user.id;
      logger.info(`User connected to realtime: ${userId} (${socket.id})`);
      
      // Join a private room for this user
      socket.join(`user:${userId}`);

      socket.on('disconnect', () => {
        logger.info(`User disconnected from realtime: ${userId}`);
      });
    });

    return this.io;
  }

  emitToUser(userId, event, data) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, data);
    }
  }

  broadcastTaskCreated(userId, task) {
    this.emitToUser(userId, 'task:created', task);
  }

  broadcastTaskUpdated(userId, task) {
    this.emitToUser(userId, 'task:updated', task);
  }

  broadcastTaskDeleted(userId, taskId) {
    this.emitToUser(userId, 'task:deleted', { id: taskId });
  }
}

// Singleton instance
module.exports = new RealtimeService();
