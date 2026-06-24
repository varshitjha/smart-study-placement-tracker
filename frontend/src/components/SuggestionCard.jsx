import React from 'react'

function SuggestionCard({ suggestions = [], examples = [] }) {
  const visibleSuggestions = (suggestions || []).filter(Boolean).slice(0, 6)
  const visibleExamples = (examples || []).filter(Boolean).slice(0, 3)

  return (
    <section className="ats-card ats-suggestion-card">
      <div className="ats-section-heading">
        <span>Next Steps</span>
        <h3>Top Suggestions</h3>
      </div>

      {visibleSuggestions.length > 0 ? (
        <div className="ats-suggestion-list">
          {visibleSuggestions.map((suggestion, index) => (
            <div className="ats-suggestion" key={`${suggestion}-${index}`}>
              <span>{index + 1}</span>
              <p>{suggestion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="ats-empty-text">No suggestions available for this scan.</p>
      )}

      {visibleExamples.length > 0 && (
        <div className="ats-example-box">
          <h4>Example Resume Bullets</h4>
          <ul>
            {visibleExamples.map((example, index) => (
              <li key={`${example}-${index}`}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default SuggestionCard
