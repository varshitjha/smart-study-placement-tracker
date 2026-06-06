// controllers/authController.js
// This file contains the actual LOGIC for auth-related API calls.
// Controllers receive the request, do the work, and send back a response.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- HELPER FUNCTION ---
// Generates a JWT token for a given user ID
// The token expires in 7 days — after that the user needs to log in again
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id }, // Payload: what we store inside the token (just the user's ID)
    process.env.JWT_SECRET, // Secret key to sign the token
    { expiresIn: "7d" } // Token expires after 7 days
  );
};

// -----------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (anyone can register)
// -----------------------------------------------
const registerUser = async (req, res) => {
  try {
    // Step 1: Get name, email, password from the request body
    const { name, email, password } = req.body;

    // Step 2: Validate — make sure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Step 3: Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Step 4: Create the new user in the database
    // The password will be automatically hashed by our pre-save hook in User.js
    const user = await User.create({ name, email, password });

    // Step 5: Send back the user info + a JWT token
    // We never send the password back, even hashed
    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// -----------------------------------------------
// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public (anyone can try to login)
// -----------------------------------------------
const loginUser = async (req, res) => {
  try {
    // Step 1: Get email and password from request body
    const { email, password } = req.body;

    // Step 2: Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Step 3: Find the user by email in the database
    const user = await User.findOne({ email });

    // Step 4: If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 5: Use our custom matchPassword method (defined in User.js)
    // This compares the entered password with the stored hashed password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 6: Password is correct — send back user info + JWT token
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };
