// src/pages/Login.jsx  [MODIFIED for Phase 2B]
// Change: replaced <div className="alert alert-error"> with toast.error()
// Everything else (form fields, validation, API call, redirect) is unchanged.

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginUser } from '../services/authService.js'

function Login() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      const response = await loginUser({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user',  JSON.stringify(response.data.user))
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">ST</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your preparation</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              className="form-input" type="email" id="email" name="email"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} autoComplete="email" autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-password-wrap">
              <input
                className="form-input" type={showPass?'text':'password'}
                id="password" name="password" placeholder="Enter your password"
                value={form.password} onChange={handleChange} autoComplete="current-password"
              />
              <button type="button" className="password-toggle-btn"
                onClick={()=>setShowPass(!showPass)} tabIndex={-1}>
                {showPass?'🙈':'👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
