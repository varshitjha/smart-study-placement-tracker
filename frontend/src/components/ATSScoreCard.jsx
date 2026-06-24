import React from 'react'

function getGrade(score) {
  if (score >= 95) return 'A+'
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

function getScoreTone(score) {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  return 'needs-improvement'
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Average Match'
  return 'Needs Improvement'
}

function ATSScoreCard({ score = 0, title = 'ATS Score', subtitle = '', meta = '' }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0))
  const grade = getGrade(normalizedScore)
  const tone = getScoreTone(normalizedScore)
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (normalizedScore / 100) * circumference
  const scoreStyle = {
    '--ats-progress-offset': progressOffset,
    '--ats-progress-length': circumference,
  }

  return (
    <section className={`ats-score-card ats-score-card--${tone}`}>
      <div className="ats-score-copy">
        <span className="ats-eyebrow">ATS Dashboard</span>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
        {meta && <span className="ats-meta">{meta}</span>}
      </div>

      <div className="ats-score-visual">
        <div className="ats-progress-circle" style={scoreStyle}>
          <svg viewBox="0 0 140 140" role="img" aria-label={`ATS score ${normalizedScore}%`}>
            <defs>
              <linearGradient id={`ats-score-gradient-${tone}`} x1="18" y1="18" x2="122" y2="122">
                <stop offset="0%" />
                <stop offset="52%" />
                <stop offset="100%" />
              </linearGradient>
            </defs>

            <circle className="ats-progress-bg" cx="70" cy="70" r={radius} />
            <circle
              className="ats-progress-value"
              cx="70"
              cy="70"
              r={radius}
              stroke={`url(#ats-score-gradient-${tone})`}
            />
          </svg>

          <div className="ats-score-inner">
            <strong>{normalizedScore}%</strong>
            <span>{getScoreLabel(normalizedScore)}</span>
          </div>
        </div>

        <div className="ats-grade-badge">
          <span>Grade</span>
          <strong>{grade}</strong>
          <small>ATS Ready</small>
        </div>
      </div>
    </section>
  )
}

export default ATSScoreCard
