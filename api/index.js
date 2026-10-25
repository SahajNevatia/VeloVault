const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB in serverless handler:', error);
  }
  return app(req, res);
};
