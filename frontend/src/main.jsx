// src/main.jsx  [MODIFIED for Phase 2B]
// Adds imports for goals.css, resume.css, dashboard2b.css
// All existing imports are unchanged.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Existing CSS (unchanged)
import './css/global.css'
import './css/layout.css'
import './css/auth.css'
import './css/dashboard.css'
import './css/study.css'
import './css/placement.css'
import './css/profile.css'

// New Phase 2B CSS
import './css/goals.css'
import './css/resume.css'
import './css/dashboard2b.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
