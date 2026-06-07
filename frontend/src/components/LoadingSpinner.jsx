// src/components/LoadingSpinner.jsx
//
// PURPOSE:
// A simple animated spinner shown while data is being fetched from the API.
// Used on every page that makes API calls.
//
// PROPS:
//   text - Optional text displayed below the spinner (default: "Loading...")

import React from 'react'

function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
