const logger = require('../utils/logger.js');

function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details || null;

  const isProduction = process.env.NODE_ENV === 'production';

  // Specific handling for Zod validation errors
  if (error.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = error.flatten();
  }

  // Sanitize 500 errors in production
  if (statusCode >= 500 && isProduction) {
    message = 'An unexpected error occurred. Please try again later.';
    details = null;
  }

  // Log error with context
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(!isProduction && error.stack ? { stack: error.stack } : {}),
  });
}

module.exports = errorHandler;

