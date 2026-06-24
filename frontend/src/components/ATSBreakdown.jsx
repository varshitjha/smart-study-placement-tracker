import React from 'react'

function ATSBreakdown({ items = [] }) {
  const visibleItems = items.filter(item => item && item.label)

  if (!visibleItems.length) return null

  return (
    <section className="ats-card ats-breakdown-card">
      <div className="ats-section-heading">
        <span>Performance</span>
        <h3>ATS Breakdown</h3>
      </div>

      <div className="ats-breakdown-list">
        {visibleItems.map(item => {
          const value = Math.max(0, Math.min(100, Number(item.value) || 0))

          return (
            <div className="ats-breakdown-item" key={item.label}>
              <div className="ats-breakdown-row">
                <span>{item.label}</span>
                <strong>{value}%</strong>
              </div>

              <div className="ats-progress-track">
                <div
                  className="ats-progress-fill"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ATSBreakdown
