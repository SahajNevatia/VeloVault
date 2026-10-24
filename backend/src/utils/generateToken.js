const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for authenticated users.
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {string} role - The user's role (user/admin)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = generateToken;
