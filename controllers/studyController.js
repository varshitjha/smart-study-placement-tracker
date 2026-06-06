// controllers/studyController.js
// This file handles the logic for Study Session APIs.
// By the time these functions run, we already know the user is logged in
// (because the protect middleware ran first and attached req.user).

const StudySession = require("../models/StudySession");

// -----------------------------------------------
// @desc    Add a new study session
// @route   POST /api/study
// @access  Private (requires login)
// -----------------------------------------------
const addStudySession = async (req, res) => {
  try {
    // Get the study session details from the request body
    const { subject, durationHours, date, notes } = req.body;

    // Validate required fields
    if (!subject || !durationHours) {
      return res.status(400).json({ message: "Subject and duration are required" });
    }

    // Create the study session in the database
    // req.user._id comes from the auth middleware — it's the logged-in user's ID
    const session = await StudySession.create({
      userId: req.user._id, // Automatically link this session to the logged-in user
      subject,
      durationHours,
      date: date || Date.now(), // Use provided date or default to now
      notes: notes || "",
    });

    res.status(201).json({
      message: "Study session added successfully",
      session,
    });
  } catch (error) {
    console.error("Add study session error:", error.message);
    res.status(500).json({ message: "Server error while adding study session" });
  }
};

// -----------------------------------------------
// @desc    Get all study sessions for the logged-in user
// @route   GET /api/study
// @access  Private (requires login)
// -----------------------------------------------
const getStudySessions = async (req, res) => {
  try {
    // Find ALL sessions where userId matches the logged-in user
    // This ensures users can ONLY see their own sessions
    // .sort({ date: -1 }) returns newest sessions first
    const sessions = await StudySession.find({ userId: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json({
      message: "Study sessions fetched successfully",
      count: sessions.length, // Tells the frontend how many sessions exist
      sessions,
    });
  } catch (error) {
    console.error("Get study sessions error:", error.message);
    res.status(500).json({ message: "Server error while fetching study sessions" });
  }
};

module.exports = { addStudySession, getStudySessions };
