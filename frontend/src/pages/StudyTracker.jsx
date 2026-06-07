// src/pages/StudyTracker.jsx
//
// PURPOSE:
// The Study Tracker page. Displays two things:
//   1. A form to add a new study session (via StudyForm component)
//   2. A table listing all past study sessions (newest first)
//
// APIs used:
//   GET  /api/study  → fetch all sessions
//   POST /api/study  → add a session (handled inside StudyForm component)

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import StudyForm from '../components/StudyForm.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getStudySessions } from '../services/studyService.js'

function StudyTracker() {
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  // Fetch sessions when the page loads
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await getStudySessions()
      // sessions are already sorted newest-first by the backend (.sort({ date: -1 }))
      setSessions(response.data.sessions || [])
    } catch (err) {
      setError('Failed to load sessions. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  // This is passed to StudyForm as a callback.
  // When a new session is saved, the form calls this to refresh the list.
  const handleSessionAdded = () => {
    fetchSessions()
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Study Tracker" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Study Tracker</h2>
            <p className="page-subtitle">Log your study sessions and track consistency</p>
          </div>

          {/* Add Session Form */}
          <StudyForm onSuccess={handleSessionAdded} />

          {/* Sessions List */}
          <div className="study-sessions-section">
            <h3 className="section-title">
              My Study Sessions
              {sessions.length > 0 && (
                <span className="session-count-badge">{sessions.length} total</span>
              )}
            </h3>

            {loading && <LoadingSpinner text="Loading sessions..." />}

            {!loading && error && (
              <div className="alert alert-error">{error}</div>
            )}

            {!loading && !error && sessions.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📖</div>
                <h3>No sessions yet</h3>
                <p>Use the form above to log your first study session.</p>
              </div>
            )}

            {!loading && !error && sessions.length > 0 && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => (
                      <tr key={session._id}>
                        <td className="row-number">{index + 1}</td>
                        <td>
                          <span className="subject-pill">{session.subject}</span>
                        </td>
                        <td className="duration-cell">
                          {session.durationHours}h
                        </td>
                        <td className="date-cell">
                          {new Date(session.date).toLocaleDateString('en-IN', {
                            day:   'numeric',
                            month: 'short',
                            year:  'numeric',
                          })}
                        </td>
                        <td className="notes-cell">
                          {session.notes || <span className="no-notes">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default StudyTracker
