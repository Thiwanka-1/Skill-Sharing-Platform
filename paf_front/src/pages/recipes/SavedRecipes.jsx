// src/pages/recipes/SavedRecipes.jsx
import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useWatchlist } from '../../hooks/useRecipes'
import RecipeCard from '../../components/RecipeCard'

export default function SavedRecipes() {
  const { data: recipes = [], isLoading, isError, error } = useWatchlist()
  const [search, setSearch] = useState('')

  if (isLoading) {
    return <div className="p-8 text-center">Loading saved recipes…</div>
  }
  if (isError) {
    return <div className="p-8 text-red-600 text-center">Error: {error.message}</div>
  }

  const filtered = recipes.filter(r =>
    r.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-whiye min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Section */}
        <div className="bg-white  p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-800">Saved Recipes</h1>
          </div>
          <div className="max-w-2xl mx-auto relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search saved recipes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              {recipes.length === 0
                ? "You haven't saved any recipes yet."
                : 'No recipes match your search.'}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(r => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
