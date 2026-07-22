module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
