// src/components/PlacementForm.jsx
//
// PURPOSE:
// A form for updating placement progress fields.
// Used on the Placement Tracker page.
// Pre-fills with existing data so the user can see and update current values.
//
// PROPS:
//   existing  - Object with current placement values (pre-fills the form)
//   onSuccess - Callback called after successful save

import React, { useState, useEffect } from 'react'
import { updatePlacementProgress } from '../services/placementService.js'

function PlacementForm({ existing, onSuccess }) {
  // Initialize form state with all fields at 0
  const [form, setForm] = useState({
    easySolved:        0,
    mediumSolved:      0,
    hardSolved:        0,
    projectsCompleted: 0,
    projectsOngoing:   0,
    aptitudeHours:     0,
    mockInterviews:    0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // When the "existing" prop changes (after data is fetched from API),
  // update the form fields to show current values
  useEffect(() => {
    if (existing) {
      setForm({
        easySolved:        existing.easySolved        || 0,
        mediumSolved:      existing.mediumSolved      || 0,
        hardSolved:        existing.hardSolved        || 0,
        projectsCompleted: existing.projectsCompleted || 0,
        projectsOngoing:   existing.projectsOngoing   || 0,
        aptitudeHours:     existing.aptitudeHours     || 0,
        mockInterviews:    existing.mockInterviews    || 0,
      })
    }
  }, [existing])

  const handleChange = (e) => {
    // parseInt converts the string value to a number
    // If empty, default to 0
    setForm({ ...form, [e.target.name]: parseInt(e.target.value) || 0 })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation: all values must be non-negative numbers
    for (const [key, value] of Object.entries(form)) {
      if (value < 0) {
        setError(`${key} cannot be negative.`)
        return
      }
    }

    setLoading(true)

    try {
      await updatePlacementProgress(form)

      setSuccess('Placement progress updated successfully!')

      // Tell the parent page to refresh the displayed data
      if (onSuccess) onSuccess()

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Field configuration — avoids repeating the same JSX for each input
  const fields = [
    { name: 'easySolved',        label: '🟢 Easy Problems Solved',     min: 0 },
    { name: 'mediumSolved',      label: '🟡 Medium Problems Solved',   min: 0 },
    { name: 'hardSolved',        label: '🔴 Hard Problems Solved',     min: 0 },
    { name: 'projectsCompleted', label: '✅ Projects Completed',       min: 0 },
    { name: 'projectsOngoing',   label: '🔄 Projects Ongoing',         min: 0 },
    { name: 'aptitudeHours',     label: '📐 Aptitude Practice (hrs)',  min: 0 },
    { name: 'mockInterviews',    label: '🎤 Mock Interviews Done',     min: 0 },
  ]

  return (
    <div className="placement-form-card">
      <h3 className="placement-form-title">✏️ Update Placement Progress</h3>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="placement-form">
        <div className="placement-form-grid">
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                className="form-input"
                type="number"
                id={field.name}
                name={field.name}
                min={field.min}
                value={form[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Progress'}
        </button>
      </form>
    </div>
  )
}

export default PlacementForm
