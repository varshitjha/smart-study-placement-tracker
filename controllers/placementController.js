// controllers/placementController.js
// This file handles the logic for Placement Progress APIs.
// A user has ONE placement progress document that gets updated over time.

const PlacementProgress = require("../models/PlacementProgress");

// -----------------------------------------------
// @desc    Create or Update placement progress
// @route   POST /api/placement
// @access  Private (requires login)
// -----------------------------------------------
const updatePlacementProgress = async (req, res) => {
  try {
    // Get all the progress fields from the request body
    const {
      easySolved,
      mediumSolved,
      hardSolved,
      projectsCompleted,
      projectsOngoing,
      aptitudeHours,
      mockInterviews,
    } = req.body;

    // Build an object with only the fields that were actually provided
    // This way if a user only updates easySolved, we don't wipe out other fields
    const updateData = {};
    if (easySolved !== undefined) updateData.easySolved = easySolved;
    if (mediumSolved !== undefined) updateData.mediumSolved = mediumSolved;
    if (hardSolved !== undefined) updateData.hardSolved = hardSolved;
    if (projectsCompleted !== undefined) updateData.projectsCompleted = projectsCompleted;
    if (projectsOngoing !== undefined) updateData.projectsOngoing = projectsOngoing;
    if (aptitudeHours !== undefined) updateData.aptitudeHours = aptitudeHours;
    if (mockInterviews !== undefined) updateData.mockInterviews = mockInterviews;

    // findOneAndUpdate with { upsert: true } means:
    //   - If a document exists for this user → UPDATE it
    //   - If no document exists yet → CREATE a new one
    // This is called an "upsert" (update + insert)
    const progress = await PlacementProgress.findOneAndUpdate(
      { userId: req.user._id }, // Find document matching this user
      { $set: updateData },      // Set only the fields we want to update
      {
        new: true,    // Return the UPDATED document (not the old one)
        upsert: true, // Create if it doesn't exist
        runValidators: true, // Run schema validators during update
      }
    );

    res.status(200).json({
      message: "Placement progress updated successfully",
      progress,
    });
  } catch (error) {
    console.error("Update placement progress error:", error.message);
    res.status(500).json({ message: "Server error while updating placement progress" });
  }
};

// -----------------------------------------------
// @desc    Get placement progress for the logged-in user
// @route   GET /api/placement
// @access  Private (requires login)
// -----------------------------------------------
const getPlacementProgress = async (req, res) => {
  try {
    // Find the placement progress document for the logged-in user
    const progress = await PlacementProgress.findOne({ userId: req.user._id });

    // If no progress document exists yet, return default empty values
    if (!progress) {
      return res.status(200).json({
        message: "No placement progress found. Start tracking to see data.",
        progress: {
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          projectsCompleted: 0,
          projectsOngoing: 0,
          aptitudeHours: 0,
          mockInterviews: 0,
        },
      });
    }

    res.status(200).json({
      message: "Placement progress fetched successfully",
      progress,
    });
  } catch (error) {
    console.error("Get placement progress error:", error.message);
    res.status(500).json({ message: "Server error while fetching placement progress" });
  }
};

module.exports = { updatePlacementProgress, getPlacementProgress };
