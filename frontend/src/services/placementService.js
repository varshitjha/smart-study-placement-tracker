// src/services/placementService.js
//
// PURPOSE:
// Contains all API functions related to placement progress.
// Token is automatically attached by the Axios interceptor in api.js.

import api from './api.js'

// ---- UPDATE (or create) PLACEMENT PROGRESS ----
// Calls: POST /api/placement
// Sends: { easySolved, mediumSolved, hardSolved, projectsCompleted,
//          projectsOngoing, aptitudeHours, mockInterviews }
// Returns: { message, progress }
// Note: The backend uses "upsert" - creates if new, updates if exists.
export const updatePlacementProgress = (progressData) => {
  return api.post('/placement', progressData)
}

// ---- GET PLACEMENT PROGRESS (for logged-in user) ----
// Calls: GET /api/placement
// Returns: { message, progress }
// If no data exists yet, backend returns zeroed-out defaults.
export const getPlacementProgress = () => {
  return api.get('/placement')
}
