// src/components/ProtectedRoute.jsx
//
// PURPOSE:
// A wrapper component that protects pages from unauthenticated access.
// If a user visits a protected route without a JWT token in localStorage,
// they are immediately redirected to the /login page.
//
// HOW TO USE:
// Wrap any page component in <ProtectedRoute> inside App.jsx:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  // Check if a JWT token exists in localStorage
  const token = localStorage.getItem('token')

  // No token = user is not logged in = redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
    // "replace" means pressing the browser Back button won't
    // bring them back to the protected page
  }

  // Token exists = user is logged in = render the protected page
  return children
}

export default ProtectedRoute
