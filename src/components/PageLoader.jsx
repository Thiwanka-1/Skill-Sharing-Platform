import React from 'react'

export default function PageLoader({ query, children }) {
  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-16 w-16 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    )
  }
  if (query.isError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {query.error.message}
      </div>
    )
  }
  return children
}
