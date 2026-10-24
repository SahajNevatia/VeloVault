module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/database.js',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterSetup: [],
  verbose: true,
};
