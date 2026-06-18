// src/components/Sidebar.jsx  [MODIFIED for Phase 2B]
// Adds: Goals and Resume Analyzer navigation links.
// Structure, styling, and logout logic are unchanged.

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/dashboard',  label: 'Dashboard',         icon: '📊' },
  { path: '/study',      label: 'Study Tracker',      icon: '📚' },
  { path: '/placement',  label: 'Placement Tracker',  icon: '🎯' },
  { path: '/goals',      label: 'Weekly Goals',       icon: '🏆' },  // NEW
  { path: '/resume',     label: 'Resume Analyzer',    icon: '📄' },  // NEW
  { path: '/profile',    label: 'Profile',             icon: '👤' },
]

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">ST</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">StudyTrack</span>
          <span className="sidebar-logo-tagline">Placement Ready</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <span className="sidebar-link-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar
