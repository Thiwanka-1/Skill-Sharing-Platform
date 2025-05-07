// src/pages/recipes/Recipes.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { useAllRecipes } from '../../hooks/useRecipes'
import RecipeCard from '../../components/RecipeCard'
import Sidebar from '../../components/Sidebar'

export default function Recipes() {
  const navigate = useNavigate()
  const { data: recipes = [], isLoading, isError, error } = useAllRecipes()
  const [search, setSearch] = useState('')

  if (isLoading) {
    return <div className="p-8 text-center">Loading recipes…</div>
  }
  if (isError) {
    return (
      <div className="p-8 text-red-600 text-center">
        Error fetching recipes: {error.message}
      </div>
    )
  }

  // Simple client‐side filter
  const filtered = recipes.filter(r =>
    r.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        

        {/* Search */}
      

        {/* Recipes grid */}
        <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between bg-white p-4">
          <h1 className="text-3xl font-bold text-gray-800">All Recipes</h1>
          <button
            onClick={() => navigate('/recipes/new')}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <FiPlus className="mr-2" /> New Recipe
          </button>
        </div>
        <div className="max-w-xl mx-auto relative">
            
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              No recipes found.
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
