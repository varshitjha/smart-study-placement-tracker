// src/services/studyService.js
//
// PURPOSE:
// Contains all API functions related to study sessions.
// Token is automatically attached by the Axios interceptor in api.js.

import api from './api.js'

// ---- ADD A STUDY SESSION ----
// Calls: POST /api/study
// Sends: { subject, durationHours, date, notes }
// Returns: { message, session }
// Requires: JWT token in Authorization header (handled by api.js)
export const addStudySession = (sessionData) => {
  return api.post('/study', sessionData)
}

// ---- GET ALL STUDY SESSIONS (for logged-in user) ----
// Calls: GET /api/study
// Sends: nothing (user is identified by the JWT token)
// Returns: { message, count, sessions: [...] }
// Requires: JWT token in Authorization header (handled by api.js)
export const getStudySessions = () => {
  return api.get('/study')
}
