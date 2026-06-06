// models/User.js
// This file defines what a "User" looks like in the database.
// Think of this as a blueprint / template for every user that registers.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the structure (schema) of the User document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // Will throw error if name not provided
      trim: true, // Removes extra spaces from start/end
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No two users can have the same email
      trim: true,
      lowercase: true, // Always store email in lowercase
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    // createdAt and updatedAt fields will be added automatically by Mongoose
    timestamps: true,
  }
);

// --- MIDDLEWARE (pre-save hook) ---
// This runs automatically BEFORE saving a user to the database
// It hashes the password so we never store plain text passwords
userSchema.pre("save", async function (next) {
  // 'this' refers to the current user document being saved

  // Only hash the password if it was changed (or is new)
  // This prevents re-hashing an already hashed password on profile updates
  if (!this.isModified("password")) {
    return next();
  }

  // bcrypt.genSalt(10) creates a "salt" — random data added before hashing
  // 10 is the number of rounds — higher = more secure but slower
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Continue to save the document
});

// --- INSTANCE METHOD ---
// A custom method we can call on any user object to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare checks if entered password matches the hashed password in DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema
// 'User' becomes the collection name in MongoDB (stored as 'users')
const User = mongoose.model("User", userSchema);

module.exports = User;
