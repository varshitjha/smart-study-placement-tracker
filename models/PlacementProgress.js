// models/PlacementProgress.js
// This file tracks a user's placement preparation progress.
// Each user has ONE placement progress document (updated over time).

const mongoose = require("mongoose");

const placementProgressSchema = new mongoose.Schema(
  {
    // Links this progress document to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only have ONE placement progress document
    },

    // LeetCode / DSA problem counts
    easySolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    mediumSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    hardSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Project tracking
    projectsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    projectsOngoing: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Hours spent on aptitude preparation
    aptitudeHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of mock interviews done
    mockInterviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementProgress = mongoose.model(
  "PlacementProgress",
  placementProgressSchema
);

module.exports = PlacementProgress;
