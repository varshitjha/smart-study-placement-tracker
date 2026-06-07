// src/components/Sidebar.jsx
//
// PURPOSE:
// The sidebar navigation shown on all dashboard pages.
// Contains links to Dashboard, Study Tracker, Placement Tracker, Profile,
// and a Logout button.
// Uses NavLink from React Router which automatically adds an "active" class
// to the currently selected link.

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

// Navigation link configuration
// Each item has a path (URL), label (displayed text), and icon (emoji)
const NAV_LINKS = [
  { path: '/dashboard',  label: 'Dashboard',          icon: '📊' },
  { path: '/study',      label: 'Study Tracker',       icon: '📚' },
  { path: '/placement',  label: 'Placement Tracker',   icon: '🎯' },
  { path: '/profile',    label: 'Profile',              icon: '👤' },
]

function Sidebar() {
  const navigate = useNavigate()

  // Logout: clear localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">

      {/* App Logo / Name */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">ST</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">StudyTrack</span>
          <span className="sidebar-logo-tagline">Placement Ready</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>

        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            // NavLink automatically passes { isActive } to the className function
            // We use it to apply the "--active" modifier class on the current page
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button at the bottom */}
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
