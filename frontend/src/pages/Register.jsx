// src/pages/Register.jsx
//
// PURPOSE:
// The registration page. Users enter name, email, and password.
// On success: saves the JWT token and user data to localStorage, redirects to /dashboard.
// On failure: shows an error message from the backend.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService.js'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  })

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ---- Client-side validation ----
    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!form.email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      // Call POST /api/auth/register
      const response = await registerUser({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      })

      // Save token and user info
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Go to dashboard
      navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">ST</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start your placement preparation journey</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-password-wrap">
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Show simple password strength hint */}
            {form.password.length > 0 && (
              <span className={`password-hint ${form.password.length >= 8 ? 'hint-good' : 'hint-weak'}`}>
                {form.password.length >= 8 ? '✓ Good length' : `${6 - form.password.length} more characters needed`}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="form-input"
              type={showPass ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {/* Inline match check */}
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span className="form-error">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

      </div>
    </div>
  )
}

export default Register
