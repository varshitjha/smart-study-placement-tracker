// src/components/Navbar.jsx
//
// PURPOSE:
// The top navigation bar shown on all dashboard pages.
// Displays the app name and the logged-in user's name.
// Reads user data from localStorage (saved during login/register).

import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

function Navbar({ pageTitle }) {
  const { isDarkMode, toggleTheme } = useTheme()

  // Read user data that was stored in localStorage during login or register
  // If nothing is stored, default to an empty object to avoid errors
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Get just the first name (e.g. "Rahul" from "Rahul Sharma")
  const firstName = user.name ? user.name.split(' ')[0] : 'Student'

  return (
    <header className="navbar">

      {/* Left side: page title */}
      <div className="navbar-left">
        <h1 className="navbar-page-title">{pageTitle}</h1>
      </div>

      {/* Right side: user info */}
      <div className="navbar-right">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-toggle-icon">{isDarkMode ? '☀' : '☾'}</span>
          <span className="theme-toggle-label">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>

        <div className="navbar-user">
          {/* Avatar circle showing first letter of name */}
          <div className="navbar-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <span className="navbar-username">{user.name || 'Student'}</span>
        </div>
      </div>

    </header>
  )
}

export default Navbar
