// models/WeeklyGoal.js
// This file tracks a user's weekly study hour target.
// A new WeeklyGoal document is created for each week.

const mongoose = require("mongoose");

const weeklyGoalSchema = new mongoose.Schema(
  {
    // Links the goal to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Target number of study hours for the week
    targetHours: {
      type: Number,
      required: [true, "Target hours are required"],
      min: [1, "Target must be at least 1 hour"],
    },

    // The Monday (or first day) of the week this goal applies to
    // Storing just the start date lets us find the goal for any given week
    weekStartDate: {
      type: Date,
      required: [true, "Week start date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const WeeklyGoal = mongoose.model("WeeklyGoal", weeklyGoalSchema);

module.exports = WeeklyGoal;
