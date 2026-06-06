// config/db.js
// This file handles the connection to MongoDB database.
// We use mongoose which makes it easier to work with MongoDB in Node.js.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MongoDB Connection Error: MONGO_URI is missing in .env");
      process.exit(1);
    }

    // mongoose.connect() tries to connect to the MongoDB URL from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host name
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the server
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
