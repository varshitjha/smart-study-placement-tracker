// src/components/DashboardCard.jsx
//
// PURPOSE:
// A simple reusable card component used on the Dashboard page.
// Each card shows an icon, a numeric value, and a label.
//
// PROPS:
//   icon     - Emoji or character to display (e.g. "📚")
//   value    - The main number or text to show prominently (e.g. "12")
//   label    - Description below the value (e.g. "Total Study Sessions")
//   color    - Optional color for the value text (e.g. "#4F46E5")

import React from 'react'

function DashboardCard({ icon, value, label, color }) {
  return (
    <div className="dashboard-card">
      {/* Icon shown at the top of the card */}
      <div className="dashboard-card-icon">{icon}</div>

      {/* The main number / value */}
      <div
        className="dashboard-card-value"
        style={{ color: color || 'var(--color-primary)' }}
      >
        {value}
      </div>

      {/* Label describing what the value means */}
      <div className="dashboard-card-label">{label}</div>
    </div>
  )
}

export default DashboardCard
