const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRepository = require('../modules/users/user.repository');
const env = require('./env');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userRepository.findByGoogleId(profile.id);
      
      if (!user) {
        // Check if user with same email exists
        user = await userRepository.findByEmail(profile.emails[0].value);
        
        if (user) {
          // Link Google ID to existing account
          user = await userRepository.update(user.id, { google_id: profile.id });
        } else {
          // Create new user
          user = await userRepository.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
          });
        }
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// No session serialization needed since we use JWT
module.exports = passport;
