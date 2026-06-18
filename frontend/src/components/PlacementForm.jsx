// src/components/PlacementForm.jsx  [MODIFIED for Phase 2B]
// Change: success/error alerts replaced with toast notifications.
// All fields, validation, and API call are unchanged.

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { updatePlacementProgress } from '../services/placementService.js'

function PlacementForm({ existing, onSuccess }) {
  const [form, setForm] = useState({
    easySolved:0, mediumSolved:0, hardSolved:0,
    projectsCompleted:0, projectsOngoing:0, aptitudeHours:0, mockInterviews:0,
  })
  const [loading, setLoading] = useState(false)

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: parseInt(e.target.value)||0 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    for (const [key, value] of Object.entries(form)) {
      if (value < 0) { toast.error(`${key} cannot be negative.`); return }
    }
    setLoading(true)
    try {
      await updatePlacementProgress(form)
      toast.success('Placement progress updated! 🎯')
      if (onSuccess) onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name:'easySolved',        label:'🟢 Easy Problems Solved'    },
    { name:'mediumSolved',      label:'🟡 Medium Problems Solved'  },
    { name:'hardSolved',        label:'🔴 Hard Problems Solved'    },
    { name:'projectsCompleted', label:'✅ Projects Completed'      },
    { name:'projectsOngoing',   label:'🔄 Projects Ongoing'        },
    { name:'aptitudeHours',     label:'📐 Aptitude Practice (hrs)' },
    { name:'mockInterviews',    label:'🎤 Mock Interviews Done'    },
  ]

  return (
    <div className="placement-form-card">
      <h3 className="placement-form-title">✏️ Update Placement Progress</h3>
      <form onSubmit={handleSubmit} className="placement-form">
        <div className="placement-form-grid">
          {fields.map(field=>(
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>{field.label}</label>
              <input className="form-input" type="number" id={field.name} name={field.name}
                min="0" value={form[field.name]} onChange={handleChange} />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Progress'}
        </button>
      </form>
    </div>
  )
}

export default PlacementForm
