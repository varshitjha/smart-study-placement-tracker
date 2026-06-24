// Phase 2C placeholder
import React from 'react';
import '../css/jobmatch.css';

const JobMatchResultCard = ({ result }) => {
  if (!result) return null;

  const {
    companyName,
    matchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    missingKeywords = [],
    recommendations = [],
  } = result;

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Weak Match';
  };

  return (
    <div className="job-match-result">
      <div className="score-header">
        <div>
          <h3>ATS Match Score</h3>
          <p>{getScoreCategory(matchScore)}</p>

          {companyName && (
            <p className="company-name">
              Target Company: <strong>{companyName}</strong>
            </p>
          )}
        </div>

        <div
          className="score-circle"
          style={{ borderColor: getScoreColor(matchScore) }}
        >
          <span style={{ color: getScoreColor(matchScore) }}>
            {matchScore}%
          </span>
        </div>
      </div>

      <div className="skills-grid">
        <section className="skill-section">
          <h4>Matched Skills</h4>

          <ul>
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, index) => (
                <li key={index} className="match-ok">
                  ✓ {skill}
                </li>
              ))
            ) : (
              <li className="none">No direct matches found</li>
            )}
          </ul>
        </section>

        <section className="skill-section">
          <h4>Missing Skills</h4>

          <ul>
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <li key={index} className="match-missing">
                  ✗ {skill}
                </li>
              ))
            ) : (
              <li className="none">No missing skills detected</li>
            )}
          </ul>
        </section>
      </div>

      {missingKeywords.length > 0 && (
        <section className="skill-section">
          <h4>Missing Keywords</h4>

          <ul>
            {missingKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="skill-section">
        <h4>Match Summary</h4>

        <p>Matched Skills: {matchedSkills.length}</p>
        <p>Missing Skills: {missingSkills.length}</p>
        <p>Match Score: {matchScore}%</p>
      </section>

      <section className="recommendations">
        <h4>Recommendations</h4>

        <ol>
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))
          ) : (
            <li>No recommendations available.</li>
          )}
        </ol>
      </section>
    </div>
  );
};

export default JobMatchResultCard;
