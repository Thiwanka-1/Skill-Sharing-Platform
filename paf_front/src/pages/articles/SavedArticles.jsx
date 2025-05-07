import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useSavedArticles } from '../../hooks/useArticles'
import ArticleCard from '../../components/ArticleCard'

export default function SavedArticles() {
  const { data: arts = [], isLoading, isError, error } = useSavedArticles()
  const [search, setSearch] = useState('')

  if (isLoading) return <div className="p-8 text-center">Loading saved articles…</div>
  if (isError)   return <div className="p-8 text-red-600 text-center">{error.message}</div>

  const filtered = arts.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white  p-4">
          <h1 className="text-3xl font-bold text-gray-800">Saved Articles</h1>
          <div className="max-w-2xl mx-auto relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search saved articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length===0 ? (
            <div className="text-center text-gray-500 mt-20">
              {arts.length ? 'No matches.' : "You haven't saved any articles yet."}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(a => <ArticleCard key={a.id} article={a}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
