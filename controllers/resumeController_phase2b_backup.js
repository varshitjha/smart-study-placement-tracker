// backend/controllers/resumeController.js
//
// PURPOSE:
// Handles resume PDF upload, text extraction, rule-based analysis, and storage.
// Uses multer (file upload) + pdf-parse (text extraction).
// Analysis is 100% rule-based — no AI, no external APIs.

const multer         = require('multer')
const pdfParse       = require('pdf-parse')
const ResumeAnalysis = require('../models/ResumeAnalysis')

// ---- MULTER CONFIGURATION ----
// Store uploaded files in memory (as Buffer) instead of writing to disk.
// This keeps the server clean and works well for small PDFs.
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed.'), false)
    }
  },
})

// Export the multer middleware so the route can use it
module.exports.uploadMiddleware = upload.single('resume')

// ---- SKILL DEFINITIONS ----
// These are the skills we look for in the resume text.
const ALL_SKILLS = {
  programming: ['c++', 'java', 'python', 'javascript', 'c language', ' c,', '\nc,', 'golang', 'kotlin', 'swift', 'ruby', 'php'],
  web:         ['html', 'css', 'react', 'node.js', 'nodejs', 'express', 'mongodb', 'angular', 'vue', 'next.js', 'nextjs'],
  placement:   ['dsa', 'data structures', 'algorithms', 'oop', 'oops', 'dbms', 'sql', 'mysql', 'postgresql', 'operating systems', 'computer networks', 'networking', 'git', 'github'],
  tools:       ['docker', 'linux', 'aws', 'firebase', 'redux', 'rest api', 'restful'],
}

// Flatten into a single list with display names
const SKILL_DISPLAY = {
  'c++': 'C++', 'java': 'Java', 'python': 'Python', 'javascript': 'JavaScript',
  'c language': 'C', ' c,': 'C', '\nc,': 'C', 'golang': 'Go', 'kotlin': 'Kotlin',
  'html': 'HTML', 'css': 'CSS', 'react': 'React', 'node.js': 'Node.js', 'nodejs': 'Node.js',
  'express': 'Express.js', 'mongodb': 'MongoDB', 'angular': 'Angular', 'vue': 'Vue.js',
  'next.js': 'Next.js', 'nextjs': 'Next.js',
  'dsa': 'DSA', 'data structures': 'Data Structures', 'algorithms': 'Algorithms',
  'oop': 'OOP', 'oops': 'OOP', 'dbms': 'DBMS', 'sql': 'SQL', 'mysql': 'MySQL',
  'postgresql': 'PostgreSQL', 'operating systems': 'Operating Systems',
  'computer networks': 'Computer Networks', 'networking': 'Networking',
  'git': 'Git', 'github': 'GitHub', 'docker': 'Docker', 'linux': 'Linux',
  'aws': 'AWS', 'firebase': 'Firebase', 'redux': 'Redux', 'rest api': 'REST API',
  'restful': 'RESTful API',
}

// Important placement skills that should ideally appear
const KEY_PLACEMENT_SKILLS = ['React', 'Node.js', 'MongoDB', 'DSA', 'SQL', 'Git', 'GitHub', 'Python', 'Java', 'OOP', 'DBMS']

// ---- CORE ANALYSIS FUNCTION ----
function analyzeResumeText(text) {
  const lower = text.toLowerCase()

  // 1. Detect which skills are present
  const foundSkillKeys = new Set()
  for (const skillList of Object.values(ALL_SKILLS)) {
    for (const skill of skillList) {
      if (lower.includes(skill)) {
        const displayName = SKILL_DISPLAY[skill]
        if (displayName) foundSkillKeys.add(displayName)
      }
    }
  }
  const skillsFound = [...foundSkillKeys]

  // 2. Which key skills are missing?
  const skillsMissing = KEY_PLACEMENT_SKILLS.filter(s => !skillsFound.includes(s)).slice(0, 8)

  // 3. Check for key resume sections
  const hasContactInfo = /email|phone|mobile|\+91|gmail|@/.test(lower)
  const hasEducation   = /education|university|college|b\.?tech|b\.?e\.|bachelor|degree|cgpa|gpa|10th|12th/.test(lower)
  const hasProjects    = /project|developed|built|created|implemented|designed/.test(lower)
  const hasGitHub      = /github\.com|github profile/.test(lower)
  const hasLinkedIn    = /linkedin\.com|linkedin profile/.test(lower)
  const hasInternship  = /intern|internship|trainee/.test(lower)
  const hasAchievement = /achievement|award|certificate|hackathon|competition|rank|winner/.test(lower)

  // 4. Score calculation
  let score = 0

  // Contact info: up to 10 pts
  if (hasContactInfo) score += 10

  // Education: up to 15 pts
  if (hasEducation) score += 15

  // Skills: up to 35 pts (each skill = 35 / totalPossible, capped at 35)
  const maxSkillScore = 35
  const skillScore = Math.min(Math.round((skillsFound.length / 10) * maxSkillScore), maxSkillScore)
  score += skillScore

  // Projects: up to 20 pts
  if (hasProjects) score += 20

  // GitHub: up to 10 pts
  if (hasGitHub) score += 10

  // Bonuses
  if (hasLinkedIn)    score += 3
  if (hasInternship)  score += 4
  if (hasAchievement) score += 3

  // Cap at 100
  score = Math.min(score, 100)

  // 5. Build suggestions
  const suggestions = []
  if (!hasContactInfo)  suggestions.push('Add clear contact information (email, phone number).')
  if (!hasEducation)    suggestions.push('Include your education section with degree and CGPA.')
  if (!hasProjects)     suggestions.push('Add a Projects section with descriptions of what you built.')
  if (!hasGitHub)       suggestions.push('Include your GitHub profile link to showcase your code.')
  if (!hasLinkedIn)     suggestions.push('Add your LinkedIn profile URL.')
  if (!hasInternship)   suggestions.push('Mention any internship or work experience.')
  if (skillsFound.length < 5) suggestions.push('Add a dedicated Technical Skills section.')
  if (!lower.includes('dsa') && !lower.includes('data structure'))
    suggestions.push('Mention DSA practice — it shows problem-solving ability to recruiters.')
  if (!lower.includes('python') && !lower.includes('java') && !lower.includes('c++'))
    suggestions.push('Include at least one core programming language prominently.')
  if (!hasAchievement)  suggestions.push('Add achievements, certifications, or hackathon participations.')

  return {
    score,
    skillsFound,
    skillsMissing,
    suggestions: suggestions.slice(0, 6),
    scoreBreakdown: { hasContactInfo, hasEducation, hasProjects, hasGitHub, skillCount: skillsFound.length },
  }
}

// -----------------------------------------------
// @desc    Upload and analyze a resume PDF
// @route   POST /api/resume/analyze
// @access  Private
// -----------------------------------------------
const analyzeResume = async (req, res) => {
  try {
    // req.file is provided by multer middleware
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF.' })
    }

    // Extract text from the PDF buffer
    const pdfData = await pdfParse(req.file.buffer)
    const text    = pdfData.text

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ message: 'Could not read text from the PDF. Please ensure it is a text-based (not scanned) PDF.' })
    }

    // Run rule-based analysis
    const analysis = analyzeResumeText(text)

    // Save the result to MongoDB
    const saved = await ResumeAnalysis.create({
      userId:         req.user._id,
      fileName:       req.file.originalname,
      score:          analysis.score,
      skillsFound:    analysis.skillsFound,
      skillsMissing:  analysis.skillsMissing,
      suggestions:    analysis.suggestions,
      scoreBreakdown: analysis.scoreBreakdown,
    })

    res.status(200).json({
      message:  'Resume analyzed successfully',
      analysis: saved,
    })
  } catch (error) {
    console.error('Resume analysis error:', error.message)
    res.status(500).json({ message: 'Server error during resume analysis. Please try again.' })
  }
}

// -----------------------------------------------
// @desc    Get the most recent resume analysis for the user
// @route   GET /api/resume/latest
// @access  Private
// -----------------------------------------------
const getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Most recent first

    if (!analysis) {
      return res.status(200).json({ message: 'No resume analyzed yet.', analysis: null })
    }

    res.status(200).json({ message: 'Latest analysis fetched', analysis })
  } catch (error) {
    console.error('Get latest analysis error:', error.message)
    res.status(500).json({ message: 'Server error while fetching analysis' })
  }
}

// -----------------------------------------------
// @desc    Get all resume analysis history for the user
// @route   GET /api/resume/history
// @access  Private
// -----------------------------------------------
const getAnalysisHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('fileName score createdAt') // Only return summary fields for the list

    res.status(200).json({ message: 'History fetched', history })
  } catch (error) {
    console.error('Get history error:', error.message)
    res.status(500).json({ message: 'Server error while fetching history' })
  }
}

module.exports = { analyzeResume, getLatestAnalysis, getAnalysisHistory, uploadMiddleware: upload.single('resume') }
