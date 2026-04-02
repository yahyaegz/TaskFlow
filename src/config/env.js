const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

if (!env.databaseUrl) {
  throw new Error('Missing DATABASE_URL in environment variables.');
}

if (!env.jwtSecret) {
  throw new Error('CRITICAL: Missing JWT_SECRET in environment variables!');
}

module.exports = env;
