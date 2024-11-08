const MongoDBStore = require('connect-mongo');
require('dotenv').config();  

// Get DB_URL from the environment variables
const { DB_URL } = process.env;

const store = MongoDBStore.create({
  mongoUrl: DB_URL,  //  MongoDB connection string
  collectionName: 'sessions',  
  ttl: 14 * 24 * 60 * 60,  
  secret: 'thisshouldbeasecret',  
  touchAfter: 24 * 60 * 60,  
});


store.on('error', function (error) {
  console.error('Session Store Error:', error);
});

module.exports = store;
