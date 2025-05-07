// src/pages/OAuth2RedirectHandler.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    if (!token) return navigate('/signin')

    localStorage.setItem('token', token)

    fetch('http://localhost:8081/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        localStorage.setItem('username', user.username)
        localStorage.setItem('email', user.email)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('roles', JSON.stringify(user.roles))
        localStorage.setItem('profilePicUrl', user.profilePicUrl || '')

        if (user.roles.includes('ROLE_ADMIN')) {
          window.location.href = '/admin/profile'
        } else {
          window.location.href = '/profile'
        }
      })
      .catch(() => navigate('/signin'))
  }, [navigate])

  return null
}
