const mongoose = require('mongoose');
const User = require('../../src/models/User');

require('../setup');

describe('User Model', () => {
  describe('Validation', () => {
    it('should create a valid user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe('user'); // Default role
    });

    it('should fail without required username', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail without required email', async () => {
      const user = new User({
        username: 'testuser',
        password: 'password123',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail without required password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with invalid email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalidemail',
        password: 'password123',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with username shorter than 3 characters', async () => {
      const user = new User({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with password shorter than 6 characters', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      const duplicateUser = new User({
        username: 'user2',
        email: 'duplicate@example.com',
        password: 'password456',
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should set default role to user', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.role).toBe('user');
    });

    it('should allow admin role', async () => {
      const user = await User.create({
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });
  });

  describe('Password Hashing', () => {
    it('should hash the password before saving', async () => {
      const rawPassword = 'password123';
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: rawPassword,
      });

      // Fetch with password field explicitly selected
      const userWithPassword = await User.findById(user._id).select('+password');
      expect(userWithPassword.password).not.toBe(rawPassword);
      expect(userWithPassword.password).toMatch(/^\$2[aby]?\$/); // bcrypt hash pattern
    });

    it('should correctly compare valid passwords', async () => {
      const rawPassword = 'password123';
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: rawPassword,
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword(rawPassword);
      expect(isMatch).toBe(true);
    });

    it('should correctly reject invalid passwords', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    it('should not re-hash password if not modified', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const originalHash = userWithPassword.password;

      // Update a non-password field
      userWithPassword.username = 'updateduser';
      await userWithPassword.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).toBe(originalHash);
    });
  });
});
