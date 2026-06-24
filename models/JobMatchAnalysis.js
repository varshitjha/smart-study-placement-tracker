// Phase 2C placeholder
const mongoose = require('mongoose');

const jobMatchAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    default: 'N/A'
  },
  jobDescription: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  matchedSkills: [{
    type: String
  }],
  missingSkills: [{
    type: String
  }],
  missingKeywords: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobMatchAnalysis', jobMatchAnalysisSchema);