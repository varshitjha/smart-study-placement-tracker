import React from 'react'

function KeywordChips({ title, keywords = [], tone = 'strong', emptyText = 'No keywords available.' }) {
  const uniqueKeywords = [...new Set((keywords || []).filter(Boolean))]

  return (
    <section className="ats-card ats-keyword-card">
      <div className="ats-section-heading">
        <span>{tone === 'missing' ? 'Needs Attention' : 'Detected'}</span>
        <h3>{title}</h3>
      </div>

      {uniqueKeywords.length > 0 ? (
        <div className="ats-chip-wrap">
          {uniqueKeywords.map(keyword => (
            <span className={`ats-chip ats-chip--${tone}`} key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="ats-empty-text">{emptyText}</p>
      )}
    </section>
  )
}

export default KeywordChips
