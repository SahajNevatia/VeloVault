const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const app = require('../backend/src/app');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI || 'mongodb+srv://sahajnevatia_db_user:sahaj@velovault.ltbifdu.mongodb.net/velovault?retryWrites=true&w=majority';
  await mongoose.connect(uri);
  isConnected = true;
};

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless DB connection error:', error);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};
