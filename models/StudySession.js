// models/StudySession.js
// This file defines what a "Study Session" looks like in the database.
// Each time a user logs a study session, one of these documents is created.

const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    // userId links this session to a specific user
    // 'ref: "User"' means this ID refers to a document in the User collection
    userId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB IDs are special ObjectId type
      ref: "User",
      required: [true, "User ID is required"],
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      // Example values: "Data Structures", "Machine Learning", "Aptitude"
    },

    durationHours: {
      type: Number,
      required: [true, "Duration is required"],
      min: [0.1, "Duration must be at least 0.1 hours"], // Minimum 6 minutes
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now, // If no date provided, use today's date
    },

    notes: {
      type: String,
      trim: true,
      default: "", // Notes are optional
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const StudySession = mongoose.model("StudySession", studySessionSchema);

module.exports = StudySession;
