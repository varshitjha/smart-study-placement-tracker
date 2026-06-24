// src/pages/ResumeAnalyzer.jsx
//
// PURPOSE:
// The Resume Analyzer page. Users upload a PDF resume and see a detailed
// analysis of their resume score, skills, and suggestions.
//
// APIs used:
//   POST /api/resume/analyze  → upload + analyze (via ResumeUpload component)
//   GET  /api/resume/latest   → load the most recent analysis on page load

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import ResumeUpload from '../components/ResumeUpload.jsx';
import JobMatchForm from '../components/JobMatchForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ATSScoreCard from '../components/ATSScoreCard.jsx';
import ATSBreakdown from '../components/ATSBreakdown.jsx';
import KeywordChips from '../components/KeywordChips.jsx';
import ATSRiskCard from '../components/ATSRiskCard.jsx';
import SuggestionCard from '../components/SuggestionCard.jsx';
import { getLatestAnalysis } from '../services/resumeService.js';

const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const calculateRatioScore = (matched = 0, missing = 0) => {
  const total = matched + missing;
  if (!total) return matched > 0 ? 100 : 0;
  return clampScore(Math.round((matched / total) * 100));
};

const buildResumeSummary = (analysis) => {
  const score = clampScore(analysis?.score);
  const skillsFound = analysis?.skillsFound || [];
  const skillsMissing = analysis?.skillsMissing || [];
  const breakdown = analysis?.scoreBreakdown || {};

  const strengths = [];
  const weaknesses = [];

  if (skillsFound.length) strengths.push(`${skillsFound.length} relevant skills detected by the analyzer.`);
  if (breakdown.hasEducation) strengths.push('Education details are present and visible to recruiters.');
  if (breakdown.hasProjects) strengths.push('Project experience is included, which helps ATS and recruiter review.');
  if (breakdown.hasGitHub) strengths.push('GitHub profile is available for proof of work.');

  if (skillsMissing.length) weaknesses.push(`${skillsMissing.length} priority placement skills are missing or not prominent.`);
  if (!breakdown.hasContactInfo) weaknesses.push('Contact information may be missing or hard to detect.');
  if (!breakdown.hasEducation) weaknesses.push('Education section needs clearer formatting.');
  if (!breakdown.hasProjects) weaknesses.push('Projects section needs stronger evidence of practical work.');
  if (!breakdown.hasGitHub) weaknesses.push('GitHub link is missing or not ATS-readable.');

  return {
    summary: score >= 75
      ? 'Your resume is positioned well for ATS screening. Focus on sharper keywords and measurable project impact.'
      : score >= 50
        ? 'Your resume has a usable foundation, but it needs stronger keyword coverage and clearer proof of work.'
        : 'Your resume needs stronger structure, keyword coverage, and recruiter-friendly details before applications.',
    strengths: strengths.length ? strengths : ['The resume has enough readable content to generate an ATS scan.'],
    weaknesses: weaknesses.length ? weaknesses : ['No major weaknesses detected from the available analysis data.'],
  };
};

const buildResumeDashboard = (analysis) => {
  const skillsFound = analysis?.skillsFound || [];
  const skillsMissing = analysis?.skillsMissing || [];
  const breakdown = analysis?.scoreBreakdown || {};
  const keywordScore = calculateRatioScore(skillsFound.length, skillsMissing.length);
  const summary = buildResumeSummary(analysis);

  const risks = [];
  if (!breakdown.hasContactInfo) risks.push({ title: 'Contact details risk', description: 'Add a clear email and phone number near the top of the resume.' });
  if (!breakdown.hasProjects) risks.push({ title: 'Project evidence risk', description: 'ATS scans and recruiters look for project names, technologies, and outcomes.' });
  if (!breakdown.hasGitHub) risks.push({ title: 'Proof-of-work risk', description: 'A visible GitHub profile can strengthen technical credibility.' });
  if ((analysis?.score || 0) < 50) risks.push({ title: 'Low ATS score risk', description: 'Improve structure, keywords, and sections before applying to competitive roles.' });

  return {
    score: analysis?.score || 0,
    title: 'Resume ATS Score',
    subtitle: summary.summary,
    meta: analysis?.fileName ? `File scanned: ${analysis.fileName}` : '',
    strengths: summary.strengths,
    weaknesses: summary.weaknesses,
    breakdownItems: [
      { label: 'Keyword Match', value: keywordScore },
      { label: 'Skills Match', value: clampScore((breakdown.skillCount || skillsFound.length) * 10) },
      { label: 'Education', value: breakdown.hasEducation ? 100 : 35 },
      { label: 'Projects', value: breakdown.hasProjects ? 100 : 30 },
      { label: 'Readability', value: breakdown.hasContactInfo ? 85 : 55 },
    ],
    strongKeywords: skillsFound,
    missingKeywords: skillsMissing,
    risks,
    suggestions: analysis?.suggestions || [],
    examples: [
      'Built a full-stack placement tracker using React, Node.js, Express, and MongoDB with authenticated user workflows.',
      'Improved resume screening readiness by adding measurable project outcomes, technical keywords, and GitHub links.',
      'Implemented REST APIs and reusable frontend components to track study sessions, goals, and placement progress.',
    ],
  };
};

const buildJobMatchDashboard = (result) => {
  const matchedSkills = result?.matchedSkills || [];
  const missingSkills = result?.missingSkills || [];
  const missingKeywords = result?.missingKeywords || [];
  const skillScore = calculateRatioScore(matchedSkills.length, missingSkills.length);

  const risks = [];
  if (missingSkills.length) risks.push({ title: 'Skill gap risk', description: 'Some required skills from the job description are missing from the resume.' });
  if (missingKeywords.length) risks.push({ title: 'Keyword gap risk', description: 'Important job-description keywords may not appear in your resume.' });
  if ((result?.matchScore || 0) < 40) risks.push({ title: 'Low match risk', description: 'Tailor the resume before applying to this role.' });

  return {
    score: result?.matchScore || 0,
    title: 'Job Match ATS Score',
    subtitle: result?.companyName
      ? `Your resume match against ${result.companyName}'s job description.`
      : 'Your resume match against the selected job description.',
    meta: result?.companyName ? `Target company: ${result.companyName}` : '',
    strengths: matchedSkills.length
      ? [`${matchedSkills.length} job-relevant skills already match the description.`]
      : ['The analyzer completed the scan, but no direct skill matches were detected.'],
    weaknesses: [
      ...(missingSkills.length ? [`${missingSkills.length} expected skills are missing or not visible enough.`] : []),
      ...(missingKeywords.length ? [`${missingKeywords.length} job-description keywords need stronger coverage.`] : []),
    ],
    breakdownItems: [
      { label: 'Keyword Match', value: calculateRatioScore(matchedSkills.length, missingKeywords.length) },
      { label: 'Skills Match', value: skillScore },
      { label: 'Education', value: 75 },
      { label: 'Projects', value: matchedSkills.length >= 3 ? 85 : 55 },
      { label: 'Readability', value: 80 },
    ],
    strongKeywords: matchedSkills,
    missingKeywords: [...missingSkills, ...missingKeywords],
    risks,
    suggestions: result?.recommendations || [],
    examples: [
      'Developed a role-relevant project using the required stack and documented measurable user or performance impact.',
      'Applied data structures, APIs, and database design to solve a practical problem aligned with the job description.',
      'Collaborated in a team environment, communicated technical decisions, and delivered features under deadlines.',
    ],
  };
};

const ATSDashboard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="ats-dashboard">
      <ATSScoreCard
        score={data.score}
        title={data.title}
        subtitle={data.subtitle}
        meta={data.meta}
      />

      <div className="ats-summary-grid">
        <section className="ats-card">
          <div className="ats-section-heading">
            <span>Resume Summary</span>
            <h3>Strengths</h3>
          </div>

          <div className="ats-summary-list">
            {data.strengths.map((item, index) => (
              <div className="ats-summary-item ats-summary-item--strength" key={`${item}-${index}`}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="ats-card">
          <div className="ats-section-heading">
            <span>Resume Summary</span>
            <h3>Weaknesses</h3>
          </div>

          <div className="ats-summary-list">
            {data.weaknesses.length > 0 ? (
              data.weaknesses.map((item, index) => (
                <div className="ats-summary-item ats-summary-item--weakness" key={`${item}-${index}`}>
                  {item}
                </div>
              ))
            ) : (
              <div className="ats-summary-item ats-summary-item--strength">
                No major weaknesses detected from the available scan data.
              </div>
            )}
          </div>
        </section>
      </div>

      <ATSBreakdown items={data.breakdownItems} />

      <div className="ats-keyword-grid">
        <KeywordChips
          title="Strong Keywords"
          keywords={data.strongKeywords}
          tone="strong"
          emptyText="No strong keywords detected yet."
        />

        <KeywordChips
          title="Missing Keywords"
          keywords={data.missingKeywords}
          tone="missing"
          emptyText="No missing keywords detected."
        />
      </div>

      <ATSRiskCard risks={data.risks} />
      <SuggestionCard suggestions={data.suggestions} examples={data.examples} />
    </div>
  );
};

function ResumeAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('resume');

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    setLoading(true);

    try {
      const res = await getLatestAnalysis();
      setAnalysis(res.data.analysis || null);
    } catch (err) {
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newAnalysis) => {
    setAnalysis(newAnalysis);
  };

  const handleJobMatchResult = (result) => {
    setJobMatchResult(result);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar pageTitle="Resume Analyzer" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Resume Analyzer</h2>

            <p className="page-subtitle">
              Analyze your resume and compare it with job descriptions.
            </p>
          </div>

          {/* Tabs */}

          <div className="resume-tabs">
            <button
              className={activeTab === 'resume' ? 'active-tab' : ''}
              onClick={() => setActiveTab('resume')}
            >
              Resume Analysis
            </button>

            <button
              className={activeTab === 'jobmatch' ? 'active-tab' : ''}
              onClick={() => setActiveTab('jobmatch')}
            >
              Job Match Analyzer
            </button>
          </div>

          {/* Resume Analysis Tab */}

          {activeTab === 'resume' && (
            <>
              <div className="resume-how-it-works">
                <div className="rhiw-item">
                  <span>📤</span>
                  <p>Upload PDF</p>
                </div>

                <div className="rhiw-arrow">→</div>

                <div className="rhiw-item">
                  <span>🔍</span>
                  <p>Text Analysis</p>
                </div>

                <div className="rhiw-arrow">→</div>

                <div className="rhiw-item">
                  <span>📊</span>
                  <p>Score Generated</p>
                </div>

                <div className="rhiw-arrow">→</div>

                <div className="rhiw-item">
                  <span>💡</span>
                  <p>Get Suggestions</p>
                </div>
              </div>

              <ResumeUpload onSuccess={handleUploadSuccess} />

              <div style={{ marginTop: '28px' }}>
                {loading ? (
                  <LoadingSpinner text="Loading your latest analysis..." />
                ) : analysis ? (
                  <ATSDashboard data={buildResumeDashboard(analysis)} />
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>

                    <h3>No analysis yet</h3>

                    <p>
                      Upload your resume above to see your placement readiness score.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Job Match Tab */}

          {activeTab === 'jobmatch' && (
            <>
              <JobMatchForm onResult={handleJobMatchResult} />

              <div style={{ marginTop: '28px' }}>
                {jobMatchResult && (
                  <ATSDashboard data={buildJobMatchDashboard(jobMatchResult)} />
                )}
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
