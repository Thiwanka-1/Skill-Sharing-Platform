import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiBell, FiX } from 'react-icons/fi'
import {
  getNotifications,
  markAllRead,
  markOneRead,
  clearAllNotifications,
  deleteOneNotification
} from '../api/notifications'
import Logo from './logo2.png'
export default function Header() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (e) {
      console.error('Failed to load notifications', e)
    }
  }

  useEffect(() => {
    fetchNotifs()
    const iv = setInterval(fetchNotifs, 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleBell = async () => {
    setOpen(o => !o)
    if (!open && unreadCount > 0) {
      await markAllRead()
      await fetchNotifs()
    }
  }

  const goTo = async n => {
    if (!n.isRead) {
      await markOneRead(n.id)
    }
    const dest = {
      RECIPE: `/recipes/${n.referenceId}`,
      ARTICLE: `/articles/${n.referenceId}`,
      VIDEO: `/videos/${n.referenceId}`
    }[n.contentType]
    if (dest) navigate(dest)
    setOpen(false)
    fetchNotifs()
  }

  const handleClearAll = async () => {
    await clearAllNotifications()
    fetchNotifs()
  }

  const handleDeleteOne = async id => {
    await deleteOneNotification(id)
    fetchNotifs()
  }

  const defaultPic =
    'https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'
  const token = localStorage.getItem('token')
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')
  const profilePic = localStorage.getItem('profilePicUrl') || defaultPic
  const handleProfileClick = () => {
    if (roles.includes('ROLE_ADMIN')) navigate('/admin/profile')
    else navigate('/profile')
  }

  return (
    <header
      className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between"
      ref={containerRef}
    >
      <Link to="/" className="text-2xl font-bold text-blue-600">
        <img src={Logo} alt="Logo" className="w-full h-16 inline-block ml-2" />
      </Link>
      <div className="flex items-center space-x-6">
        <nav className="space-x-4">
          <NavLink to="/recipes" className={({ isActive }) =>
            isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
          }>Recipes</NavLink>
          <NavLink to="/articles" className={({ isActive }) =>
            isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
          }>Articles</NavLink>
          <NavLink to="/videos" className={({ isActive }) =>
            isActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
          }>Videos</NavLink>
          
        </nav>

        {token && (
          <div className="relative">
            <button onClick={handleBell} className="text-gray-600 hover:text-gray-800 focus:outline-none mt-2">
              <FiBell size={24} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded z-20 overflow-hidden">
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  <button onClick={handleClearAll} className="text-sm text-gray-500 hover:text-gray-700">
                    Clear All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`relative p-3 flex flex-col cursor-pointer hover:bg-gray-50 ${
                          !n.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div onClick={() => goTo(n)}>
                          <span className="text-sm">{n.message}</span>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteOne(n.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!token ? (
          <Link to="/signin" className="text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50">
            Sign In
          </Link>
        ) : (
          <button onClick={handleProfileClick} className="flex items-center space-x-2 focus:outline-none">
            <img
              src={profilePic}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
            />
          </button>
        )}
      </div>
    </header>
  )
}
