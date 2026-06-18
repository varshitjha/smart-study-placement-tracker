// src/services/goalService.js
//
// PURPOSE:
// Contains all API functions for the Weekly Goals feature.
// Token is automatically attached by the Axios interceptor in api.js.

import api from './api.js'

// POST /api/goals
// Body: { targetHours, weekStartDate? }
// Creates or updates the goal for the current week
export const setWeeklyGoal = (data) => api.post('/goals', data)

// GET /api/goals/current
// Returns the goal for the current week (or null if not set)
export const getCurrentGoal = () => api.get('/goals/current')

// GET /api/goals
// Returns all goals (history)
export const getAllGoals = () => api.get('/goals')
