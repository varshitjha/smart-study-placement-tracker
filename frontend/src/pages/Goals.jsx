// src/pages/Goals.jsx
//
// PURPOSE:
// Weekly Goals page. Users can set a target study hours for the current week
// and see their progress toward that goal.
//
// APIs used:
//   POST /api/goals          → set/update this week's goal
//   GET  /api/goals/current  → get this week's goal
//   GET  /api/study          → get sessions to calculate completed hours

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import GoalCard from '../components/GoalCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import toast from 'react-hot-toast'
import { setWeeklyGoal, getCurrentGoal } from '../services/goalService.js'
import { getStudySessions } from '../services/studyService.js'

function Goals() {
  const [currentGoal,    setCurrentGoal]    = useState(null)
  const [sessions,       setSessions]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [targetHours,    setTargetHours]    = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [goalRes, sessRes] = await Promise.all([
        getCurrentGoal(),
        getStudySessions(),
      ])
      const goal = goalRes.data.goal
      setCurrentGoal(goal)
      setSessions(sessRes.data.sessions || [])
      // Pre-fill the form with existing target if set
      if (goal) setTargetHours(String(goal.targetHours))
    } catch (err) {
      toast.error('Failed to load goals. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  // Compute how many hours the user has studied THIS week
  const getWeeklyCompletedHours = () => {
    const now       = new Date()
    const dayOfWeek = now.getDay()
    const diff      = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday    = new Date(now)
    monday.setDate(now.getDate() + diff)
    monday.setHours(0, 0, 0, 0)

    return sessions
      .filter(s => new Date(s.date) >= monday)
      .reduce((sum, s) => sum + (s.durationHours || 0), 0)
  }

  const completedHours = getWeeklyCompletedHours()

  const handleSaveGoal = async (e) => {
    e.preventDefault()
    const hrs = parseFloat(targetHours)
    if (!hrs || hrs < 1 || hrs > 168) {
      toast.error('Please enter a valid target between 1 and 168 hours.')
      return
    }
    setSaving(true)
    try {
      const res = await setWeeklyGoal({ targetHours: hrs })
      setCurrentGoal(res.data.goal)
      toast.success('Weekly goal saved! 🎯')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save goal.')
    } finally {
      setSaving(false)
    }
  }

  // Label for common preset targets
  const PRESETS = [10, 15, 20, 25, 30, 40]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar pageTitle="Weekly Goals" />

        <main className="page-content">

          <div className="page-header">
            <h2 className="page-title">Weekly Goals</h2>
            <p className="page-subtitle">Set a study target for this week and track your progress</p>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading your goal..." />
          ) : (
            <>
              {/* Goal Progress Card */}
              <div style={{ marginBottom: '28px' }}>
                <GoalCard goal={currentGoal} completedHours={completedHours} />
              </div>

              {/* Set / Update Goal Form */}
              <div className="goals-form-card">
                <h3 className="goals-form-title">
                  {currentGoal ? '✏️ Update This Week\'s Goal' : '🎯 Set This Week\'s Goal'}
                </h3>

                <form onSubmit={handleSaveGoal} className="goals-form">
                  <div className="goals-presets">
                    <p className="goals-presets-label">Quick select:</p>
                    <div className="goals-presets-row">
                      {PRESETS.map(h => (
                        <button
                          key={h}
                          type="button"
                          className={`goals-preset-btn ${targetHours === String(h) ? 'goals-preset-btn--active' : ''}`}
                          onClick={() => setTargetHours(String(h))}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="targetHours">
                      Or enter a custom target (hours)
                    </label>
                    <input
                      className="form-input goals-target-input"
                      type="number"
                      id="targetHours"
                      placeholder="e.g. 20"
                      min="1"
                      max="168"
                      step="0.5"
                      value={targetHours}
                      onChange={e => setTargetHours(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving || !targetHours}
                  >
                    {saving ? 'Saving...' : currentGoal ? 'Update Goal' : 'Set Goal'}
                  </button>
                </form>
              </div>

              {/* Tip */}
              <div className="goals-tip">
                <span className="goals-tip-icon">💡</span>
                <p>
                  Your goal resets every Monday. Study sessions you log on the Study Tracker
                  page automatically count toward your weekly progress.
                </p>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default Goals
