// backend/models/ResumeAnalysis.js
//
// PURPOSE:
// Stores the result of a resume analysis for a user.
// Each time a user uploads a resume, one document is created.
// A user can have multiple analyses (history of uploads).

const mongoose = require('mongoose')

const resumeAnalysisSchema = new mongoose.Schema(
  {
    // Links this analysis to a specific user
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Original filename of the uploaded PDF
    fileName: {
      type:    String,
      default: 'resume.pdf',
    },

    // The overall score out of 100
    score: {
      type: Number,
      min:  0,
      max:  100,
    },

    // Array of skill names found in the resume text
    // Example: ["Java", "SQL", "React"]
    skillsFound: {
      type:    [String],
      default: [],
    },

    // Array of important skills NOT found in the resume
    skillsMissing: {
      type:    [String],
      default: [],
    },

    // Array of suggestion strings
    // Example: ["Add GitHub profile", "Mention DSA practice"]
    suggestions: {
      type:    [String],
      default: [],
    },

    // Breakdown of what contributed to the score
    // Stored as a plain object — flexible for future use
    scoreBreakdown: {
      hasContactInfo: { type: Boolean, default: false },
      hasEducation:   { type: Boolean, default: false },
      hasProjects:    { type: Boolean, default: false },
      hasGitHub:      { type: Boolean, default: false },
      skillCount:     { type: Number,  default: 0     },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema)

module.exports = ResumeAnalysis
