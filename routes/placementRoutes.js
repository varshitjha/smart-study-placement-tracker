// routes/placementRoutes.js
// This file defines the URL paths for Placement Progress APIs.
// All routes are PROTECTED — user must be logged in.

const express = require("express");
const router = express.Router();

const { updatePlacementProgress, getPlacementProgress } = require("../controllers/placementController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/placement  →  Create or update placement progress
router.post("/", protect, updatePlacementProgress);

// GET /api/placement  →  Get placement progress for the logged-in user
router.get("/", protect, getPlacementProgress);

module.exports = router;
