// src/App.jsx
// Root component. Sets up React Router and defines all page routes.
// Protected routes use the ProtectedRoute component to check for a JWT token.

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Page imports
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudyTracker from './pages/StudyTracker.jsx'
import PlacementTracker from './pages/PlacementTracker.jsx'
import Profile from './pages/Profile.jsx'

// Component imports
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---- Public Routes (anyone can visit) ---- */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---- Protected Routes (must be logged in) ---- */}
        {/*
          Each protected page is wrapped in <ProtectedRoute>.
          ProtectedRoute checks localStorage for a JWT token.
          If no token exists, it redirects the user to /login.
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <StudyTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement"
          element={
            <ProtectedRoute>
              <PlacementTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ---- Default Redirect ---- */}
        {/* Visiting "/" sends the user to /dashboard */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        {/* Any unknown URL also goes to dashboard */}
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
