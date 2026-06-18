// src/components/StudyForm.jsx  [MODIFIED for Phase 2B]
// Change: success/error alerts replaced with toast notifications.
// All form fields, validation logic, and API call are unchanged.

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { addStudySession } from '../services/studyService.js'

const SUBJECTS = [
  'Data Structures', 'Algorithms', 'Operating Systems', 'Database Management (DBMS)',
  'Computer Networks', 'Web Development', 'Machine Learning', 'Aptitude Practice',
  'Communication Skills', 'System Design', 'Other',
]

function StudyForm({ onSuccess }) {
  const [form, setForm] = useState({
    subject:       '',
    durationHours: '',
    date:          new Date().toISOString().slice(0,10),
    notes:         '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.subject)                               { toast.error('Please select a subject.');                     return }
    if (!form.durationHours || parseFloat(form.durationHours)<=0) { toast.error('Please enter a valid duration.'); return }
    if (!form.date)                                  { toast.error('Please select a date.');                        return }

    setLoading(true)
    try {
      await addStudySession({
        subject:       form.subject,
        durationHours: parseFloat(form.durationHours),
        date:          form.date,
        notes:         form.notes,
      })
      toast.success('Study session logged! 📚')
      setForm({ subject:'', durationHours:'', date:new Date().toISOString().slice(0,10), notes:'' })
      if (onSuccess) onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="study-form-card">
      <h3 className="study-form-title">📝 Log a Study Session</h3>
      <form onSubmit={handleSubmit} className="study-form">

        <div className="form-group">
          <label className="form-label" htmlFor="subject">Subject *</label>
          <select className="form-input" id="subject" name="subject" value={form.subject} onChange={handleChange}>
            <option value="">-- Select a subject --</option>
            {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="durationHours">Duration (hours) *</label>
            <input className="form-input" type="number" id="durationHours" name="durationHours"
              placeholder="e.g. 2.5" step="0.5" min="0.1" max="24"
              value={form.durationHours} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date *</label>
            <input className="form-input" type="date" id="date" name="date"
              value={form.date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notes">Notes (optional)</label>
          <input className="form-input" type="text" id="notes" name="notes"
            placeholder="What did you cover today?" value={form.notes} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Add Session'}
        </button>
      </form>
    </div>
  )
}

export default StudyForm
