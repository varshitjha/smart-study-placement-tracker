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
  matchJobDescription,
  uploadMiddleware,
} = require('../controllers/resumeController')

const { protect } = require('../middleware/authMiddleware')

// POST /api/resume/analyze
router.post('/analyze', uploadMiddleware, protect, analyzeResume)

// POST /api/resume/job-match
router.post('/job-match', uploadMiddleware, protect, matchJobDescription)

// GET /api/resume/latest
router.get('/latest', protect, getLatestAnalysis)

// GET /api/resume/history
router.get('/history', protect, getAnalysisHistory)

module.exports = router