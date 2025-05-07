import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useMyVideos } from '../../hooks/useVideos'
import MyVideoCard from '../../components/MyVideoCard'

export default function MyVideos() {
  const navigate = useNavigate()
  const { data: vids = [], isLoading, isError, error } = useMyVideos()
  const [search, setSearch] = useState('')

  if (isLoading) return <div className="p-8 text-center">Loading your videos…</div>
  if (isError)   return <div className="p-8 text-red-600 text-center">Error: {error.message}</div>

  const filtered = vids.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-800">My Videos</h1>
            <button
              onClick={()=>navigate('/videos/new')}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              <FiPlus className="mr-2"/> Upload Video
            </button>
          </div>
          <div className="max-w-2xl mx-auto relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Search your videos..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length===0 ? (
            <div className="text-center text-gray-500 mt-20">
              {vids.length ? 'No videos match your search.' : 'You haven’t uploaded any videos yet.'}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(v => <MyVideoCard key={v.id} video={v}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
