const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../users/user.repository.js');
const env = require('../../config/env.js');
const HttpError = require('../../utils/http-error.js');

async function register(data) {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    throw new HttpError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await userRepository.create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: 'user',
  });

  return user;
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordCorrect) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

module.exports = {
  register,
  login,
};
