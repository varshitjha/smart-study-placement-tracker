import React from 'react'

function ATSRiskCard({ risks = [] }) {
  const visibleRisks = risks.filter(Boolean)

  if (!visibleRisks.length) {
    return (
      <section className="ats-card ats-risk-card">
        <div className="ats-section-heading">
          <span>Risk Scan</span>
          <h3>ATS Risks</h3>
        </div>

        <div className="ats-risk ats-risk--success">
          <span className="ats-risk-icon">OK</span>
          <div>
            <strong>No major ATS risks detected</strong>
            <p>Your resume data looks stable for this scan.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="ats-card ats-risk-card">
      <div className="ats-section-heading">
        <span>Risk Scan</span>
        <h3>ATS Risks</h3>
      </div>

      <div className="ats-risk-list">
        {visibleRisks.map((risk, index) => (
          <div className="ats-risk" key={`${risk.title}-${index}`}>
            <span className="ats-risk-icon">!</span>
            <div>
              <strong>{risk.title}</strong>
              <p>{risk.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ATSRiskCard
