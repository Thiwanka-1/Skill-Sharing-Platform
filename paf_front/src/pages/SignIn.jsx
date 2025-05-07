// src/pages/SignIn.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaGoogle } from 'react-icons/fa'
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (name, value) => {
    if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address'
    if (name === 'password' && value.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const handleBlur = e => {
    const { name, value } = e.target
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key])
      if (err) newErrors[key] = err
    })
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(typeof data === 'string' ? data : 'Login failed')
        return
      }

      // store and redirect…
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)
      localStorage.setItem('userId', data.id)
      localStorage.setItem('profilePicUrl', data.profilePicUrl || '')
      localStorage.setItem('roles', JSON.stringify(data.roles || []))

      if ((data.roles || []).includes('ROLE_ADMIN')) {
        window.location.href = '/admin/profile'
      } else {
        window.location.href = '/profile'
      }
    } catch (err) {
      console.error(err)
      setServerError('Server error, please try again.')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
          {serverError && <div className="mb-4 text-red-600 text-sm text-center">{serverError}</div>}

          {/* Email */}
          <div className="mb-4">
            <label className="flex items-center text-gray-700 mb-1">
              <FaEnvelope className="mr-2" /> Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="flex items-center text-gray-700 mb-1">
              <HiLockClosed className="mr-2" /> Password
            </label>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
            Sign In
          </button>

          {/* Google */}
          <div className="mt-4 text-center">
            <a
              href="http://localhost:8081/oauth2/authorization/google"
              className="inline-flex items-center justify-center w-full border border-gray-300 py-2 rounded hover:bg-gray-100"
            >
              <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
              Continue with Google
            </a>
          </div>


          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
      {/* Photo half */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/fried-chicken-with-vegetables-herbs-aluminum-skillet_140725-3253.jpg')"
        }}
      />
    </div>
  )
}
