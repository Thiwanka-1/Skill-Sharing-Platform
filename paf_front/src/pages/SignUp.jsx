// src/pages/SignUp.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope ,FaGoogle} from 'react-icons/fa'
import { HiLockClosed, HiEye, HiEyeOff  } from 'react-icons/hi'

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required'
        return ''
      case 'email':
        if (!value) return 'Email is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== form.password) return 'Passwords do not match'
        return ''
      default:
        return ''
    }
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
      const res = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      })
      const text = await res.text()
      if (!res.ok) {
        setServerError(text)
      } else {
        navigate('/signin')
      }
    } catch {
      setServerError('Server error, please try again.')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
          {serverError && <div className="mb-4 text-red-600 text-sm text-center">{serverError}</div>}

          {/* Username */}
          <div className="mb-4">
            <label className="flex items-center text-gray-700 mb-1">
              <FaUser className="mr-2" /> Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

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
          <div className="mb-4 relative">
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
            <button type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <label className="flex items-center text-gray-700 mb-1">
              <HiLockClosed className="mr-2" /> Confirm Password
            </label>
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
            />
            <button type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirm ? <HiEyeOff /> : <HiEye />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
            Create Account
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
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/top-view-bowl-with-lentils-variety-condiments_1220-423.jpg')"
        }}
      />
    </div>
  )
}
