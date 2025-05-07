// src/pages/recipes/MyRecipes.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useMyRecipes } from '../../hooks/useRecipes'
import MyRecipeCard from '../../components/MyRecipeCard'

export default function MyRecipes() {
  const navigate = useNavigate()
  const { data: recipes = [], isLoading, isError, error } = useMyRecipes()
  const [search, setSearch] = useState('')

  if (isLoading) {
    return <div className="p-8 text-center">Loading your recipes…</div>
  }
  if (isError) {
    return <div className="p-8 text-red-600 text-center">Error: {error.message}</div>
  }

  // filter by topic
  const filtered = recipes.filter(r =>
    r.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top section */}
        <div className="bg-white  p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
            <button
              onClick={() => navigate('/recipes/new')}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              <FiPlus className="mr-2" /> Add Recipe
            </button>
          </div>
          <div className="max-w-2xl mx-auto relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your recipes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              {recipes.length === 0
                ? "You haven’t added any recipes yet."
                : "No recipes match your search."}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(r => (
                <MyRecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
