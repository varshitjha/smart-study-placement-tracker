// src/components/DashboardCard.jsx  [MODIFIED for Phase 2B]
// Change: added optional onClick prop so the Resume Score card can navigate to /resume.
// All existing props and appearance are unchanged.

import React from 'react'

function DashboardCard({ icon, value, label, color, onClick }) {
  return (
    <div
      className={`dashboard-card ${onClick ? 'dashboard-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key==='Enter' && onClick() : undefined}
    >
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-value" style={{ color: color || 'var(--color-primary)' }}>
        {value}
      </div>
      <div className="dashboard-card-label">{label}</div>
    </div>
  )
}

export default DashboardCard
