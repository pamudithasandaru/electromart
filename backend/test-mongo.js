const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electromart';

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', MONGO_URI);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('✗ Failed to connect to MongoDB:');
    console.error('  Error:', err.message);
    console.error('\nTroubleshooting:');
    console.error('1. Is MongoDB running? Start it with: docker run -d -p 27017:27017 mongo:6.0');
    console.error('2. Check MONGODB_URI in .env');
    process.exit(1);
  });
