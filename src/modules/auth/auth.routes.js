const express = require('express');
const controller = require('./auth.controller.js');
const asyncHandler = require('../../utils/async-handler.js');
const auth = require('../../middleware/auth.middleware.js');
const passport = require('../../config/passport');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');

const router = express.Router();

router.post('/register', asyncHandler(controller.register));
router.post('/login', asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.get('/me', auth, asyncHandler(controller.me));

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
  (req, res) => {
    // Generate JWT for the authenticated user
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Redirect to frontend dashboard
    res.redirect('http://localhost:5173/');
  }
);

module.exports = router;
