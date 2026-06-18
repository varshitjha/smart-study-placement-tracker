// src/pages/ResumeAnalyzer.jsx
//
// PURPOSE:
// The Resume Analyzer page. Users upload a PDF resume and see a detailed
// analysis of their resume score, skills, and suggestions.
//
// APIs used:
//   POST /api/resume/analyze  → upload + analyze (via ResumeUpload component)
//   GET  /api/resume/latest   → load the most recent analysis on page load

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import ResumeUpload from '../components/ResumeUpload.jsx'
import ResumeScoreCard from '../components/ResumeScoreCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getLatestAnalysis } from '../services/resumeService.js'

function ResumeAnalyzer() {
  const [analysis, setAnalysis] = useState(null)
  const [loading,  setLoading]  = useState(true)

  // Load the most recent analysis when the page opens
  useEffect(() => {
    fetchLatest()
  }, [])

  const fetchLatest = async () => {
    setLoading(true)
    try {
      const res = await getLatestAnalysis()
      setAnalysis(res.data.analysis || null)
    } catch (err) {
      // If there's no analysis yet, that's fine — just show null
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  // Called by ResumeUpload after a successful upload
  const handleUploadSuccess = (newAnalysis) => {
    setAnalysis(newAnalysis)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Resume Analyzer" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Resume Analyzer</h2>
            <p className="page-subtitle">
              Upload your PDF resume to get a placement-readiness score and improvement suggestions
            </p>
          </div>

          {/* How it works banner */}
          <div className="resume-how-it-works">
            <div className="rhiw-item"><span>📤</span><p>Upload PDF</p></div>
            <div className="rhiw-arrow">→</div>
            <div className="rhiw-item"><span>🔍</span><p>Text Analysis</p></div>
            <div className="rhiw-arrow">→</div>
            <div className="rhiw-item"><span>📊</span><p>Score Generated</p></div>
            <div className="rhiw-arrow">→</div>
            <div className="rhiw-item"><span>💡</span><p>Get Suggestions</p></div>
          </div>

          {/* Upload Area */}
          <ResumeUpload onSuccess={handleUploadSuccess} />

          {/* Analysis Result */}
          <div style={{ marginTop: '28px' }}>
            {loading ? (
              <LoadingSpinner text="Loading your latest analysis..." />
            ) : analysis ? (
              <ResumeScoreCard analysis={analysis} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No analysis yet</h3>
                <p>Upload your resume above to see your placement readiness score.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default ResumeAnalyzer
