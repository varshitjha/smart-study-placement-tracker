// src/pages/Profile.jsx
//
// PURPOSE:
// Displays the logged-in user's profile information.
// Reads from localStorage (saved during login/register).
// Also shows a summary of study and placement stats.
//
// APIs used:
//   GET /api/study      → total sessions and hours
//   GET /api/placement  → total DSA solved

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getStudySessions } from '../services/studyService.js'
import { getPlacementProgress } from '../services/placementService.js'

function Profile() {
  // Read user from localStorage — this was stored during login/register
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [sessions,  setSessions]  = useState([])
  const [placement, setPlacement] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [studyRes, placementRes] = await Promise.all([
        getStudySessions(),
        getPlacementProgress(),
      ])
      setSessions(studyRes.data.sessions || [])
      setPlacement(placementRes.data.progress || null)
    } catch (err) {
      // Profile page is mostly display — don't block on error
      console.error('Profile stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Computed stats
  const totalHours    = sessions.reduce((sum, s) => sum + (s.durationHours || 0), 0).toFixed(1)
  const totalSessions = sessions.length
  const totalDSA      = placement
    ? (placement.easySolved || 0) + (placement.mediumSolved || 0) + (placement.hardSolved || 0)
    : 0

  // Format the join date from the user's _id
  // MongoDB ObjectId contains a timestamp — but we'll use a simple approach:
  // If the user object has a createdAt (not typical from our backend response),
  // use it. Otherwise show a friendly default.
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Member'

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Profile" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">My Profile</h2>
            <p className="page-subtitle">Your account information and stats summary</p>
          </div>

          {/* Profile Card */}
          <div className="profile-card">

            {/* Avatar + Basic Info */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user.name || 'Student'}</h2>
                <p className="profile-email">{user.email || 'No email'}</p>
                <span className="profile-badge">🎓 Placement Aspirant</span>
              </div>
            </div>

            {/* Divider */}
            <hr className="profile-divider" />

            {/* Account Details */}
            <div className="profile-details">
              <h3 className="profile-section-title">Account Details</h3>
              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.name || '—'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email || '—'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value detail-value--mono">
                    {user._id ? `...${user._id.slice(-8)}` : '—'}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{joinDate}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Summary */}
          <div className="profile-stats-section">
            <h3 className="section-title">My Stats Summary</h3>

            {loading && <LoadingSpinner text="Loading stats..." />}

            {!loading && (
              <div className="profile-stats-grid">
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">📋</div>
                  <div className="profile-stat-value">{totalSessions}</div>
                  <div className="profile-stat-label">Study Sessions</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">⏱️</div>
                  <div className="profile-stat-value">{totalHours}h</div>
                  <div className="profile-stat-label">Hours Studied</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">💻</div>
                  <div className="profile-stat-value">{totalDSA}</div>
                  <div className="profile-stat-label">DSA Problems</div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-icon">🚀</div>
                  <div className="profile-stat-value">{placement?.projectsCompleted || 0}</div>
                  <div className="profile-stat-label">Projects Done</div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default Profile
