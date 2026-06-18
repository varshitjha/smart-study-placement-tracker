// backend/server.js  [MODIFIED for Phase 2B]
// Added: weeklyGoalRoutes, resumeRoutes
// Everything else is unchanged from Phase 2A.

require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const connectDB = require('./config/db')

// ---- Existing Route Imports ----
const authRoutes      = require('./routes/authRoutes')
const studyRoutes     = require('./routes/studyRoutes')
const placementRoutes = require('./routes/placementRoutes')

// ---- NEW Phase 2B Route Imports ----
const weeklyGoalRoutes = require('./routes/weeklyGoalRoutes')
const resumeRoutes     = require('./routes/resumeRoutes')

connectDB()

const app = express()

app.use(express.json())
app.use(cors())

// ---- Existing Routes (unchanged) ----
app.use('/api/auth',      authRoutes)
app.use('/api/study',     studyRoutes)
app.use('/api/placement', placementRoutes)

// ---- NEW Phase 2B Routes ----
app.use('/api/goals',  weeklyGoalRoutes)
app.use('/api/resume', resumeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Smart Study + Placement Tracker API is running!' })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
