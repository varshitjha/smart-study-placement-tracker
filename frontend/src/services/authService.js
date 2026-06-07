// src/services/authService.js
//
// PURPOSE:
// Contains all API functions related to authentication (login, register).
// Pages import these functions instead of writing Axios calls directly.
// This keeps pages clean and makes it easy to update API calls in one place.

import api from './api.js'

// ---- REGISTER ----
// Calls: POST /api/auth/register
// Sends: { name, email, password }
// Returns: { message, user: { _id, name, email }, token }
export const registerUser = (userData) => {
  return api.post('/auth/register', userData)
}

// ---- LOGIN ----
// Calls: POST /api/auth/login
// Sends: { email, password }
// Returns: { message, user: { _id, name, email }, token }
export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials)
}
