const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    isConnected = false;
    throw error;
  }
}

module.exports = connectDB;