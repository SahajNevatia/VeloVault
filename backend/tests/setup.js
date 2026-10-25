const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Test setup: creates an in-memory MongoDB instance for testing.
 * This ensures tests are isolated and don't affect the real database.
 */
beforeAll(async () => {
  const fs = require('fs');
  const localMongo = 'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe';
  if (fs.existsSync(localMongo) && !process.env.MONGOMS_SYSTEM_BINARY) {
    process.env.MONGOMS_SYSTEM_BINARY = localMongo;
  }
  mongoServer = await MongoMemoryServer.create({
    instance: {
      storageEngine: 'wiredTiger',
    },
    binary: {
      systemBinary: fs.existsSync(localMongo) ? localMongo : undefined,
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000);

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
