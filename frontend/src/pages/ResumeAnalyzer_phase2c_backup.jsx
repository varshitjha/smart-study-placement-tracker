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
import ResumeScoreCard from '../components/ResumeScoreCard.jsx';
import JobMatchForm from '../components/JobMatchForm.jsx';
import JobMatchResultCard from '../components/JobMatchResultCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getLatestAnalysis } from '../services/resumeService.js';

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
                  <ResumeScoreCard analysis={analysis} />
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
                  <JobMatchResultCard result={jobMatchResult} />
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