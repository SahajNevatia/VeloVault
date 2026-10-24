const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Service layer for authentication operations.
 * Encapsulates business logic separate from route handlers.
 */
class AuthService {
  /**
   * Registers a new user in the system.
   * @param {Object} userData - { username, email, password, role }
   * @returns {Object} Created user data and JWT token
   * @throws {Error} If email or username already exists
   */
  async register({ username, email, password, role }) {
    // Check for existing user by email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      const error = new Error(`A user with this ${field} already exists.`);
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ username, email, password, role });
    const token = generateToken(user._id, user.role);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Authenticates a user with email and password.
   * @param {Object} credentials - { email, password }
   * @returns {Object} User data and JWT token
   * @throws {Error} If credentials are invalid
   */
  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id, user.role);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

module.exports = new AuthService();
