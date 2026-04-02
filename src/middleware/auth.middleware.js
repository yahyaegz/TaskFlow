const jwt = require('jsonwebtoken');
const env = require('../config/env.js');
const userRepository = require('../modules/users/user.repository.js');
const HttpError = require('../utils/http-error.js');
const asyncHandler = require('../utils/async-handler.js');

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new HttpError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new HttpError(401, 'Invalid or expired token');
  }
});

module.exports = auth;
