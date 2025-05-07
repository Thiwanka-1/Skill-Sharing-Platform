// src/components/Sidebar.jsx
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FaUser,
  FaBook,
  FaVideo,
  FaQuestionCircle,
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaRegSave,
  FaRegListAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa'

export default function Sidebar({ isAdmin = false }) {
  const { user } = useAuth()
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMenu = key =>
    setOpenMenu(openMenu === key ? null : key)

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/signin'
  }

  // Top-level items
  const menuItems = isAdmin
    ? [
        { key: 'users',    label: 'Manage Users',   to: '/users',      icon: FaUsers },
        { key: 'recipes',  label: 'Recipes',        to: '/recipes',    icon: FaBook,      hasSub: true },
        { key: 'articles', label: 'Articles',       to: '/articles',   icon: FaBook,      hasSub: true },
        { key: 'videos',   label: 'Videos',         to: '/videos',     icon: FaVideo,     hasSub: true },
      ]
    : [
        { key: 'profile',  label: 'Profile',        to: '/profile',    icon: FaUser,      hasSub: true },
        { key: 'recipes',  label: 'Recipes',        to: '/recipes',    icon: FaBook,      hasSub: true },
        { key: 'articles', label: 'Articles',       to: '/articles',   icon: FaBook,      hasSub: true },
        { key: 'videos',   label: 'Videos',         to: '/videos',     icon: FaVideo,     hasSub: true },
      ]

  // Define submenus
  const submenus = {
    profile: [
      { to: '/profile',           label: 'Edit Profile', viewKey: 'edit', icon: FaUser },
      { to: `/users/${user?.id}`, label: 'View Public Profile', viewKey: 'view', icon: FaUsers },
    ],
    recipes: [
      { to: '/recipes',       label: 'All Recipes',   icon: FaRegListAlt },
      { to: '/recipes/my',    label: 'My Recipes',    icon: FaRegSave    },
      { to: '/recipes/saved', label: 'Saved Recipes', icon: FaRegSave    },
    ],
    articles: [
      { to: '/articles',         label: 'All Articles',   icon: FaRegListAlt },
      { to: '/articles/my',      label: 'My Articles',    icon: FaRegSave    },
      { to: '/articles/saved',   label: 'Saved Articles', icon: FaRegSave    },
    ],
    videos: [
      { to: '/videos',         label: 'All Videos',     icon: FaRegListAlt },
      { to: '/videos/my',      label: 'My Videos',      icon: FaRegSave    },
      { to: '/videos/saved',   label: 'Saved Videos',   icon: FaRegSave    },
    ],
  }

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-white rounded shadow"
        onClick={() => setMobileOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Overlay when open on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Close btn on mobile */}
        <div className="flex justify-end md:hidden p-2">
          <button onClick={() => setMobileOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-4 text-2xl font-bold text-blue-600"></div>

        <nav className="flex-1 px-4">
          {menuItems.map(item => {
            const Icon = item.icon
            const isOpen = openMenu === item.key
            const matchPath = window.location.pathname.startsWith(item.to)

            return (
              <div key={item.key}>
                <button
                  onClick={() =>
                    item.hasSub ? toggleMenu(item.key) : null
                  }
                  className={`
                    w-full flex items-center p-3 my-1 rounded
                    ${matchPath
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <Icon className="mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSub && (
                    isOpen
                      ? <FaChevronUp className="text-gray-500" />
                      : <FaChevronDown className="text-gray-500" />
                  )}
                </button>

                {item.hasSub && isOpen && (
                  <div className="pl-8">
                    {submenus[item.key].map(sub => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `flex items-center p-2 mb-1 rounded ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`
                        }
                      >
                        <sub.icon className="mr-2" />
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center p-3 m-4 text-red-600 hover:bg-red-50 rounded mt-auto"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </aside>
    </>
  )
}
