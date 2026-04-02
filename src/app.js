const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const taskRoutes = require('./modules/tasks/task.routes.js');
const authRoutes = require('./modules/auth/auth.routes.js');
const notFound = require('./middleware/not-found.js');
const errorHandler = require('./middleware/error-handler.js');
const pool = require('./db/pool.js');
const passport = require('./config/passport');

const rateLimit = require('express-rate-limit');
const userRoutes = require('./modules/users/user.routes.js');
const categoryRoutes = require('./modules/categories/category.routes.js');
const tagRoutes = require('./modules/tags/tag.routes.js');
const notificationRoutes = require('./modules/notifications/notification.routes.js');
const analyticsRoutes = require('./modules/analytics/analytics.routes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      data: {
        service: 'taskflow-backend',
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
