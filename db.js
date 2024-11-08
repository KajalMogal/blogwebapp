const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected to:', connection.connection.host);  
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the app if the connection fails
  }
};

module.exports = connectDB;