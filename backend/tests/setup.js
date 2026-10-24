const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Test setup: creates an in-memory MongoDB instance for testing.
 * This ensures tests are isolated and don't affect the real database.
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

/**
 * Cleans up all collections between tests for isolation.
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

/**
 * Tears down the in-memory database and closes the connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
