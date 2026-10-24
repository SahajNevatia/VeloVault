const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB database.
 * Uses the MONGODB_URI from environment variables.
 * Includes error handling and connection event logging.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
