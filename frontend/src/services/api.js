// src/services/api.js
//
// PURPOSE:
// Creates a shared Axios instance that ALL service files use.
// This means we only define the base URL and token logic ONCE here,
// and every other service file just imports from this file.
//
// HOW JWT WORKS HERE:
// Before every request, the interceptor reads the token from localStorage
// and adds it to the Authorization header automatically.
// This means you don't need to manually pass the token in every API call.

import axios from 'axios'

// The backend server URL. Change this if your backend runs on a different port.
const BASE_URL = 'http://localhost:8000/api'

// Create a custom Axios instance with the base URL set
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ---- REQUEST INTERCEPTOR ----
// This function runs automatically before every outgoing request.
api.interceptors.request.use(
  (config) => {
    // Read the JWT token saved in localStorage during login/register
    const token = localStorage.getItem('token')

    // If a token exists, attach it to the Authorization header
    // Format: "Bearer eyJhbGciOi..."
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config // Continue sending the request
  },
  (error) => {
    // If something goes wrong before the request is sent, reject it
    return Promise.reject(error)
  }
)

// ---- RESPONSE INTERCEPTOR ----
// This function runs for every response received from the backend.
api.interceptors.response.use(
  (response) => response, // Success: just pass the response through

  (error) => {
    // If the backend returns 401 (Unauthorized), the token is invalid or expired.
    // Clear localStorage and redirect to the login page.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
