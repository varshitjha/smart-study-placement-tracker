// src/components/StudyForm.jsx
//
// PURPOSE:
// A form component for adding a new study session.
// Used on the Study Tracker page.
// When the form is submitted successfully, it calls onSuccess()
// so the parent page can refresh the list of sessions.
//
// PROPS:
//   onSuccess - Callback function called after a session is saved successfully

import React, { useState } from 'react'
import { addStudySession } from '../services/studyService.js'

// Preset list of subjects for the dropdown
const SUBJECTS = [
  'Data Structures',
  'Algorithms',
  'Operating Systems',
  'Database Management (DBMS)',
  'Computer Networks',
  'Web Development',
  'Machine Learning',
  'Aptitude Practice',
  'Communication Skills',
  'System Design',
  'Other',
]

function StudyForm({ onSuccess }) {
  // Form field values stored in state
  const [form, setForm] = useState({
    subject: '',
    durationHours: '',
    date: new Date().toISOString().slice(0, 10), // Default to today's date
    notes: '',
  })

  const [loading, setLoading] = useState(false) // Is the form submitting?
  const [error, setError]     = useState('')     // Error message from API
  const [success, setSuccess] = useState('')     // Success message

  // Update state whenever a field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')    // Clear error when user starts typing
    setSuccess('')  // Clear success message too
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent browser from refreshing the page

    // ---- Basic Validation ----
    if (!form.subject) {
      setError('Please select a subject.')
      return
    }
    if (!form.durationHours || parseFloat(form.durationHours) <= 0) {
      setError('Please enter a valid duration (greater than 0).')
      return
    }
    if (!form.date) {
      setError('Please select a date.')
      return
    }

    setLoading(true)

    try {
      // Call the backend API to save the session
      await addStudySession({
        subject:       form.subject,
        durationHours: parseFloat(form.durationHours), // Convert string to number
        date:          form.date,
        notes:         form.notes,
      })

      // Show success message
      setSuccess('Study session added successfully!')

      // Reset the form fields
      setForm({
        subject:       '',
        durationHours: '',
        date:          new Date().toISOString().slice(0, 10),
        notes:         '',
      })

      // Tell the parent page to refresh the sessions list
      if (onSuccess) onSuccess()

    } catch (err) {
      // Show error message from backend, or a generic message
      setError(err.response?.data?.message || 'Failed to add session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="study-form-card">
      <h3 className="study-form-title">📝 Log a Study Session</h3>

      {/* Success and Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="study-form">

        {/* Subject Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="subject">Subject *</label>
          <select
            className="form-input"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          >
            <option value="">-- Select a subject --</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Duration and Date side by side */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="durationHours">Duration (hours) *</label>
            <input
              className="form-input"
              type="number"
              id="durationHours"
              name="durationHours"
              placeholder="e.g. 2.5"
              step="0.5"
              min="0.1"
              max="24"
              value={form.durationHours}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date">Date *</label>
            <input
              className="form-input"
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes (optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes (optional)</label>
          <input
            className="form-input"
            type="text"
            id="notes"
            name="notes"
            placeholder="What did you cover today?"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Session'}
        </button>

      </form>
    </div>
  )
}

export default StudyForm
