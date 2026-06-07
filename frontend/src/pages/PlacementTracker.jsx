// src/pages/PlacementTracker.jsx
//
// PURPOSE:
// The Placement Tracker page. Shows current placement progress values
// and provides a form to update them.
//
// The backend uses "upsert" for the POST /api/placement endpoint:
// - First time: creates a new document
// - Subsequent times: updates the existing document
//
// APIs used:
//   GET  /api/placement  → fetch current progress
//   POST /api/placement  → update progress (handled inside PlacementForm)

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import PlacementForm from '../components/PlacementForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getPlacementProgress } from '../services/placementService.js'

function PlacementTracker() {
  const [progress, setProgress] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    setLoading(true)
    try {
      const response = await getPlacementProgress()
      setProgress(response.data.progress || null)
    } catch (err) {
      setError('Failed to load placement data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  // Called by PlacementForm after a successful save
  const handleProgressUpdated = () => {
    fetchProgress()
  }

  // Helper: total DSA solved across all difficulties
  const totalDSA = progress
    ? (progress.easySolved || 0) + (progress.mediumSolved || 0) + (progress.hardSolved || 0)
    : 0

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Placement Tracker" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Placement Tracker</h2>
            <p className="page-subtitle">Track your DSA, projects, aptitude, and interview readiness</p>
          </div>

          {/* Update Form */}
          <PlacementForm
            existing={progress}
            onSuccess={handleProgressUpdated}
          />

          {/* Current Progress Display */}
          <div className="placement-current">
            <h3 className="section-title">Current Progress</h3>

            {loading && <LoadingSpinner text="Loading progress..." />}

            {!loading && error && (
              <div className="alert alert-error">{error}</div>
            )}

            {!loading && !error && progress && (
              <div className="placement-stats-grid">

                {/* DSA Section */}
                <div className="placement-stat-group">
                  <h4 className="stat-group-title">💻 DSA Problems</h4>
                  <div className="stat-row">
                    <span className="stat-label">🟢 Easy</span>
                    <span className="stat-value">{progress.easySolved || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">🟡 Medium</span>
                    <span className="stat-value">{progress.mediumSolved || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">🔴 Hard</span>
                    <span className="stat-value">{progress.hardSolved || 0}</span>
                  </div>
                  <div className="stat-row stat-row--total">
                    <span className="stat-label">Total</span>
                    <span className="stat-value stat-value--highlight">{totalDSA}</span>
                  </div>
                </div>

                {/* Projects Section */}
                <div className="placement-stat-group">
                  <h4 className="stat-group-title">🚀 Projects</h4>
                  <div className="stat-row">
                    <span className="stat-label">✅ Completed</span>
                    <span className="stat-value">{progress.projectsCompleted || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">🔄 Ongoing</span>
                    <span className="stat-value">{progress.projectsOngoing || 0}</span>
                  </div>
                </div>

                {/* Other Section */}
                <div className="placement-stat-group">
                  <h4 className="stat-group-title">📐 Other Prep</h4>
                  <div className="stat-row">
                    <span className="stat-label">Aptitude Hours</span>
                    <span className="stat-value">{progress.aptitudeHours || 0}h</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Mock Interviews</span>
                    <span className="stat-value">{progress.mockInterviews || 0}</span>
                  </div>
                </div>

              </div>
            )}

            {/* No data yet */}
            {!loading && !error && !progress && (
              <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <h3>No progress saved yet</h3>
                <p>Use the form above to save your first progress update!</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default PlacementTracker
