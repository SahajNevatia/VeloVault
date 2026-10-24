const mongoose = require('mongoose');
const User = require('../../src/models/User');
const authService = require('../../src/services/authService');

// Need to set JWT_SECRET for token generation
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';

require('../setup');

describe('Auth Service', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.username).toBe('newuser');
      expect(result.user.email).toBe('new@example.com');
      expect(result.user.role).toBe('user');
    });

    it('should register an admin user', async () => {
      const result = await authService.register({
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      expect(result.user.role).toBe('admin');
    });

    it('should throw error for duplicate email', async () => {
      await authService.register({
        username: 'user1',
        email: 'dupe@example.com',
        password: 'password123',
      });

      try {
        await authService.register({
          username: 'user2',
          email: 'dupe@example.com',
          password: 'password456',
        });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toContain('email');
      }
    });

    it('should throw error for duplicate username', async () => {
      await authService.register({
        username: 'dupeuser',
        email: 'first@example.com',
        password: 'password123',
      });

      try {
        await authService.register({
          username: 'dupeuser',
          email: 'second@example.com',
          password: 'password456',
        });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toContain('username');
      }
    });

    it('should not return password in user object', async () => {
      const result = await authService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.user.password).toBeUndefined();
    });

    it('should return a valid JWT token', async () => {
      const result = await authService.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3); // JWT format: header.payload.signature
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register({
        username: 'logintest',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const result = await authService.login({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('login@example.com');
    });

    it('should throw error for wrong email', async () => {
      try {
        await authService.login({
          email: 'wrong@example.com',
          password: 'password123',
        });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toContain('Invalid');
      }
    });

    it('should throw error for wrong password', async () => {
      try {
        await authService.login({
          email: 'login@example.com',
          password: 'wrongpassword',
        });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toContain('Invalid');
      }
    });

    it('should return a valid JWT token on login', async () => {
      const result = await authService.login({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3);
    });
  });
});
