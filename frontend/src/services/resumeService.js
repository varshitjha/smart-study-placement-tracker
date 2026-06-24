// src/services/resumeService.js
//
// PURPOSE:
// Contains all API functions for the Resume Analyzer feature.
// The upload uses FormData (multipart) — not JSON — because we are sending a file.

import api from './api.js'

// POST /api/resume/analyze
// Sends a PDF file as FormData
// Returns the analysis result
export const uploadAndAnalyzeResume = (file) => {
  const formData = new FormData()
  formData.append('resume', file) // 'resume' must match multer's field name in backend

  return api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// GET /api/resume/latest
export const getLatestAnalysis = () => api.get('/resume/latest')

// GET /api/resume/history
export const getAnalysisHistory = () => api.get('/resume/history')

// POST /api/resume/job-match
export const matchJobDescription = (file, companyName, jobDescription) => {
  const formData = new FormData()

  formData.append('resume', file)
  formData.append('companyName', companyName)
  formData.append('jobDescription', jobDescription)

  return api.post('/resume/job-match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
