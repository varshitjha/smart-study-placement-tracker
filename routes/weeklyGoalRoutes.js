// backend/routes/weeklyGoalRoutes.js
//
// PURPOSE:
// Defines all URL routes for the Weekly Goals API.
// All routes are protected — requires a valid JWT token.

const express = require('express')
const router  = express.Router()

const { setWeeklyGoal, getCurrentGoal, getAllGoals } = require('../controllers/weeklyGoalController')
const { protect } = require('../middleware/authMiddleware')

// POST /api/goals           → Create or update this week's goal
router.post('/',          protect, setWeeklyGoal)

// GET  /api/goals/current   → Get the goal for the current week
router.get('/current',    protect, getCurrentGoal)

// GET  /api/goals           → Get all historical goals
router.get('/',           protect, getAllGoals)

module.exports = router
