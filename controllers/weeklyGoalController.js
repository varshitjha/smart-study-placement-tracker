// backend/controllers/weeklyGoalController.js
//
// PURPOSE:
// Handles all logic for the Weekly Goals API.
// A user can have one goal per week. The weekStartDate field (Monday of the week)
// is used to identify which week the goal belongs to.
// Uses upsert: if a goal for that week exists, update it. If not, create it.

const WeeklyGoal = require('../models/WeeklyGoal')

// ---- HELPER: Get the Monday of whatever week a given date falls in ----
// Example: Wednesday 2024-01-10 → Monday 2024-01-08
function getMondayOfWeek(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date()
  const day = date.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day // Adjust so Monday = 0
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

// -----------------------------------------------
// @desc    Create or update weekly goal for current week
// @route   POST /api/goals
// @access  Private
// -----------------------------------------------
const setWeeklyGoal = async (req, res) => {
  try {
    const { targetHours, weekStartDate } = req.body

    // Validate
    if (!targetHours || targetHours < 1) {
      return res.status(400).json({ message: 'Target hours must be at least 1.' })
    }

    // Determine which Monday this goal applies to
    const monday = getMondayOfWeek(weekStartDate)

    // Upsert: find a goal for this user + this week, update or create
    const goal = await WeeklyGoal.findOneAndUpdate(
      {
        userId:        req.user._id,
        weekStartDate: monday,
      },
      {
        $set: { targetHours }
      },
      {
        new:          true,  // Return the updated document
        upsert:       true,  // Create if doesn't exist
        runValidators: true,
      }
    )

    res.status(200).json({
      message: 'Weekly goal saved successfully',
      goal,
    })
  } catch (error) {
    console.error('Set weekly goal error:', error.message)
    res.status(500).json({ message: 'Server error while saving weekly goal' })
  }
}

// -----------------------------------------------
// @desc    Get weekly goal for the current week
// @route   GET /api/goals/current
// @access  Private
// -----------------------------------------------
const getCurrentGoal = async (req, res) => {
  try {
    const monday = getMondayOfWeek()

    const goal = await WeeklyGoal.findOne({
      userId:        req.user._id,
      weekStartDate: monday,
    })

    if (!goal) {
      // No goal set for this week — return a default response
      return res.status(200).json({
        message: 'No goal set for this week.',
        goal: null,
      })
    }

    res.status(200).json({
      message: 'Weekly goal fetched successfully',
      goal,
    })
  } catch (error) {
    console.error('Get current goal error:', error.message)
    res.status(500).json({ message: 'Server error while fetching weekly goal' })
  }
}

// -----------------------------------------------
// @desc    Get all weekly goals (goal history)
// @route   GET /api/goals
// @access  Private
// -----------------------------------------------
const getAllGoals = async (req, res) => {
  try {
    const goals = await WeeklyGoal.find({ userId: req.user._id })
      .sort({ weekStartDate: -1 }) // Newest first

    res.status(200).json({
      message: 'All goals fetched successfully',
      goals,
    })
  } catch (error) {
    console.error('Get all goals error:', error.message)
    res.status(500).json({ message: 'Server error while fetching goals' })
  }
}

module.exports = { setWeeklyGoal, getCurrentGoal, getAllGoals }
