// routes/authRoutes.js
// This file defines the URL paths (routes) for authentication.
// Routes connect a URL + HTTP method to a specific controller function.

const express = require("express");
const router = express.Router(); // Express Router lets us group related routes

const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register  →  calls registerUser function
router.post("/register", registerUser);

// POST /api/auth/login  →  calls loginUser function
router.post("/login", loginUser);

module.exports = router;
