// src/App.jsx  [MODIFIED for Phase 2B]
// Adds routes: /goals and /resume
// All existing routes are unchanged.

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Existing pages (unchanged)
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudyTracker from './pages/StudyTracker.jsx'
import PlacementTracker from './pages/PlacementTracker.jsx'
import Profile from './pages/Profile.jsx'

// New Phase 2B pages
import Goals from './pages/Goals.jsx'
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      {/* Toast notification container — renders toasts globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — existing */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/study"     element={<ProtectedRoute><StudyTracker /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><PlacementTracker /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected routes — new Phase 2B */}
        <Route path="/goals"  element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />

        {/* Defaults */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
