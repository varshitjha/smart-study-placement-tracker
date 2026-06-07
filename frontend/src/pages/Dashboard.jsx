// src/pages/Dashboard.jsx
//
// PURPOSE:
// The main dashboard page shown after login.
// Fetches data from two APIs (study sessions + placement progress)
// and displays four summary metric cards.
//
// APIs used:
//   GET /api/study      → to count sessions and total hours
//   GET /api/placement  → to get DSA count and projects completed

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getStudySessions } from '../services/studyService.js'
import { getPlacementProgress } from '../services/placementService.js'

function Dashboard() {
  // State for the fetched data
  const [sessions,   setSessions]   = useState([])
  const [placement,  setPlacement]  = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  // Fetch data when the component mounts (first renders)
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Run both API calls at the same time for efficiency
      const [studyRes, placementRes] = await Promise.all([
        getStudySessions(),
        getPlacementProgress(),
      ])

      setSessions(studyRes.data.sessions || [])
      setPlacement(placementRes.data.progress || null)

    } catch (err) {
      setError('Failed to load dashboard data. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Compute summary values from fetched data ----

  // Total number of study sessions logged
  const totalSessions = sessions.length

  // Sum all durationHours values and round to 1 decimal
  const totalHours = sessions
    .reduce((sum, s) => sum + (s.durationHours || 0), 0)
    .toFixed(1)

  // Total DSA questions = easy + medium + hard
  const totalDSA = placement
    ? (placement.easySolved || 0) + (placement.mediumSolved || 0) + (placement.hardSolved || 0)
    : 0

  // Number of completed projects
  const projectsDone = placement ? (placement.projectsCompleted || 0) : 0

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Dashboard" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Overview</h2>
            <p className="page-subtitle">Your placement preparation at a glance</p>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner text="Loading your data..." />}

          {/* Error State */}
          {!loading && error && (
            <div className="alert alert-error">{error}</div>
          )}

          {/* Dashboard Cards */}
          {!loading && !error && (
            <div className="dashboard-cards-grid">
              <DashboardCard
                icon="📋"
                value={totalSessions}
                label="Total Study Sessions"
                color="#4F46E5"
              />
              <DashboardCard
                icon="⏱️"
                value={`${totalHours}h`}
                label="Total Study Hours"
                color="#10B981"
              />
              <DashboardCard
                icon="💻"
                value={totalDSA}
                label="DSA Questions Solved"
                color="#F59E0B"
              />
              <DashboardCard
                icon="🚀"
                value={projectsDone}
                label="Projects Completed"
                color="#EF4444"
              />
            </div>
          )}

          {/* Empty state — no sessions yet */}
          {!loading && !error && totalSessions === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No study sessions yet</h3>
              <p>Go to <strong>Study Tracker</strong> to log your first session!</p>
            </div>
          )}

          {/* Recent Sessions Preview */}
          {!loading && !error && sessions.length > 0 && (
            <div className="dashboard-recent">
              <h3 className="section-title">Recent Study Sessions</h3>
              <div className="recent-sessions-list">
                {/* Show only the 5 most recent sessions */}
                {sessions.slice(0, 5).map((session) => (
                  <div key={session._id} className="recent-session-item">
                    <div className="recent-session-left">
                      <span className="recent-session-subject">{session.subject}</span>
                      <span className="recent-session-notes">{session.notes || 'No notes'}</span>
                    </div>
                    <div className="recent-session-right">
                      <span className="recent-session-hours">{session.durationHours}h</span>
                      <span className="recent-session-date">
                        {new Date(session.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default Dashboard
