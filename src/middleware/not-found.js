const HttpError = require('../utils/http-error.js');

function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
