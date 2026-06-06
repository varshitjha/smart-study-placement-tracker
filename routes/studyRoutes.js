// routes/studyRoutes.js
// This file defines the URL paths for Study Session APIs.
// All routes here are PROTECTED — the user must be logged in to use them.

const express = require("express");
const router = express.Router();

const { addStudySession, getStudySessions } = require("../controllers/studyController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/study  →  Add a new study session
// 'protect' runs FIRST (checks the token), then addStudySession runs
router.post("/", protect, addStudySession);

// GET /api/study  →  Get all study sessions for the logged-in user
router.get("/", protect, getStudySessions);

module.exports = router;
