// backend/routes/resumeRoutes.js
//
// PURPOSE:
// Defines routes for the Resume Analyzer feature.
// All routes are protected (JWT required).
// The multer upload middleware runs BEFORE the controller on the analyze route.

const express = require('express')
const router  = express.Router()

const {
  analyzeResume,
  getLatestAnalysis,
  getAnalysisHistory,
  uploadMiddleware,
} = require('../controllers/resumeController')

const { protect } = require('../middleware/authMiddleware')

// POST /api/resume/analyze   → Upload PDF + run analysis
// uploadMiddleware runs first (handles the multipart/form-data file upload)
// then protect checks the JWT, then analyzeResume runs the analysis
router.post('/analyze',  uploadMiddleware, protect, analyzeResume)

// GET  /api/resume/latest    → Get the most recent analysis result
router.get('/latest',   protect, getLatestAnalysis)

// GET  /api/resume/history   → Get list of all past analyses
router.get('/history',  protect, getAnalysisHistory)

module.exports = router
