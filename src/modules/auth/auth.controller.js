const service = require('./auth.service.js');
const { registerSchema, loginSchema } = require('./auth.validation.js');
const HttpError = require('../../utils/http-error.js');

async function register(req, res) {
  const payload = registerSchema.parse(req.body);
  const user = await service.register(payload);
  return res.status(201).json({ success: true, data: { user } });
}

async function login(req, res) {
  const payload = loginSchema.parse(req.body);
  const { user, token } = await service.login(payload.email, payload.password);

  // Set HTTP-only cookie for the token
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.json({ success: true, data: { user, token } });
}

async function logout(req, res) {
  res.clearCookie('token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
}

async function me(req, res) {
  return res.json({ success: true, data: { user: req.user } });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
