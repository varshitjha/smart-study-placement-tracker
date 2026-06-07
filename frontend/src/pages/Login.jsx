// src/pages/Login.jsx
//
// PURPOSE:
// The login page. Users enter their email and password.
// On success: saves the JWT token and user data to localStorage, then redirects to /dashboard.
// On failure: shows an error message.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService.js'

function Login() {
  const navigate = useNavigate()

  // Form field state
  const [form, setForm] = useState({
    email:    '',
    password: '',
  })

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    try {
      // Call POST /api/auth/login
      const response = await loginUser({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      })

      // Save the token and user info to localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to the dashboard
      navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your preparation</p>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>

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
              autoFocus
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Link to Register */}
        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>

      </div>
    </div>
  )
}

export default Login
