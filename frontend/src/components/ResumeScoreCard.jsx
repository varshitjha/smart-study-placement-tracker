// src/components/ResumeScoreCard.jsx
//
// PURPOSE:
// Displays the full analysis result from the resume analyzer backend.
// Shows: Score, Skills Found, Skills Missing, and Suggestions.
//
// PROPS:
//   analysis - The analysis object from the backend

import React from 'react'

// Color for the score circle
function getScoreColor(score) {
  if (score >= 75) return '#10B981' // Green
  if (score >= 50) return '#F59E0B' // Yellow
  return '#EF4444'                  // Red
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 45) return 'Average'
  return 'Needs Work'
}

function ResumeScoreCard({ analysis }) {
  if (!analysis) return null

  const color = getScoreColor(analysis.score)
  const label = getScoreLabel(analysis.score)

  return (
    <div className="resume-score-card">

      {/* Score Header */}
      <div className="rsc-header">
        <div className="rsc-score-circle" style={{ borderColor: color }}>
          <span className="rsc-score-num" style={{ color }}>{analysis.score}</span>
          <span className="rsc-score-100">/100</span>
        </div>
        <div className="rsc-header-info">
          <h3 className="rsc-title">Resume Score</h3>
          <span className="rsc-label" style={{ background: `${color}22`, color }}>{label}</span>
          {analysis.fileName && (
            <p className="rsc-filename">📄 {analysis.fileName}</p>
          )}
          <p className="rsc-date">
            Analyzed on {new Date(analysis.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="rsc-breakdown">
        <h4 className="rsc-section-title">✅ Checklist</h4>
        <div className="rsc-checks">
          {[
            { key: 'hasContactInfo', label: 'Contact Information' },
            { key: 'hasEducation',   label: 'Education Section' },
            { key: 'hasProjects',    label: 'Projects Mentioned' },
            { key: 'hasGitHub',      label: 'GitHub Profile' },
          ].map(item => (
            <div key={item.key} className={`rsc-check-item ${analysis.scoreBreakdown?.[item.key] ? 'rsc-check--pass' : 'rsc-check--fail'}`}>
              <span className="rsc-check-icon">
                {analysis.scoreBreakdown?.[item.key] ? '✓' : '✗'}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Found */}
      {analysis.skillsFound?.length > 0 && (
        <div className="rsc-section">
          <h4 className="rsc-section-title">💚 Skills Found ({analysis.skillsFound.length})</h4>
          <div className="rsc-skills-wrap">
            {analysis.skillsFound.map(skill => (
              <span key={skill} className="rsc-skill rsc-skill--found">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Missing */}
      {analysis.skillsMissing?.length > 0 && (
        <div className="rsc-section">
          <h4 className="rsc-section-title">❌ Key Skills Missing</h4>
          <div className="rsc-skills-wrap">
            {analysis.skillsMissing.map(skill => (
              <span key={skill} className="rsc-skill rsc-skill--missing">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions?.length > 0 && (
        <div className="rsc-section">
          <h4 className="rsc-section-title">💡 Suggestions to Improve</h4>
          <ul className="rsc-suggestions">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="rsc-suggestion-item">
                <span className="rsc-suggestion-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default ResumeScoreCard
