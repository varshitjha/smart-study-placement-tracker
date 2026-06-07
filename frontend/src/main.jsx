// src/main.jsx
// Entry point for the React application.
// Renders the root App component into the HTML element with id="root".

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global CSS is imported here so it applies to everything
import './css/global.css'
import './css/layout.css'
import './css/auth.css'
import './css/dashboard.css'
import './css/study.css'
import './css/placement.css'
import './css/profile.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
