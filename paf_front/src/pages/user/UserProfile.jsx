// src/pages/users/UserProfile.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUser, useFollowUser, useUnfollowUser } from '../../hooks/useUsers'
import { useAllRecipes } from '../../hooks/useRecipes'
import { useAllArticles } from '../../hooks/useArticles'
import { useAllVideos } from '../../hooks/useVideos'
import RecipeCard from '../../components/RecipeCard'
import ArticleCard from '../../components/ArticleCard'
import VideoCard from '../../components/VideoCard'
import Sidebar from '../../components/Sidebar'

const defaultPic = 'https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg'

export default function UserProfile() {
  const { id } = useParams()
  const { user: me } = useAuth()

  const { data: profile, isLoading, isError, error } = useUser(id)
  const { data: allRecipes = [] }  = useAllRecipes()
  const { data: allArticles = [] } = useAllArticles()
  const { data: allVideos   = [] } = useAllVideos()

  const followMut   = useFollowUser()
  const unfollowMut = useUnfollowUser()
  const [tab, setTab] = useState('recipes')

  // local UI state
  const [isFollowingLocal, setIsFollowingLocal] = useState(false)
  const [followerCount, setFollowerCount]       = useState(0)

  // initialise local state once profile arrives
  useEffect(() => {
    if (profile) {
      setIsFollowingLocal(
        Array.isArray(profile.followers) &&
        profile.followers.some(u => String(u.id) === String(me.id))
      )
      setFollowerCount(profile.followers?.length || 0)
    }
  }, [profile, me.id])

  if (isLoading) return <div className="p-8 text-center">Loading…</div>
  if (isError)   return <div className="p-8 text-red-600">{error.message}</div>
  if (!profile)  return null

  const isMe = String(me.id) === String(profile.id)

  // click handler
  const handleFollowToggle = () => {
    if (isFollowingLocal) {
      unfollowMut.mutate(profile.id, {
        onSuccess: () => {
          setIsFollowingLocal(false)
          setFollowerCount(c => c - 1)
        }
      })
    } else {
      followMut.mutate(profile.id, {
        onSuccess: () => {
          setIsFollowingLocal(true)
          setFollowerCount(c => c + 1)
        }
      })
    }
  }

  // filter their content
  const userRecipes  = allRecipes .filter(r => r.uploadedBy === profile.email)
  const userArticles = allArticles.filter(a => a.uploadedBy === profile.email)
  const userVideos   = allVideos  .filter(v => v.uploadedBy === profile.email)

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* PROFILE HEADER */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-6">
          <img
            src={profile.profilePicUrl || defaultPic}
            alt=""
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.username}</h2>
            <p className="text-gray-600">{profile.bio}</p>
            <div className="mt-2 flex space-x-4 text-sm">
              <span>{followerCount} Followers</span>
              <span>{profile.following?.length || 0} Following</span>
            </div>
          </div>
          {!isMe && (
            <button
              onClick={handleFollowToggle}
              className={`ml-auto px-4 py-2 rounded ${
                isFollowingLocal
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}
              disabled={followMut.isLoading || unfollowMut.isLoading}
            >
              {isFollowingLocal ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <nav className="flex border-b mb-4 text-gray-700">
            {['recipes','articles','videos'].map(key => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`mr-6 pb-2 ${
                  tab===key ? 'border-b-2 border-blue-600 text-blue-600':''}`}
              >
                {key.charAt(0).toUpperCase()+key.slice(1)}
              </button>
            ))}
          </nav>

          {/* CONTENT */}
          <div>
            {tab==='recipes' && (
              userRecipes.length
                ? <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {userRecipes.map(r=> <RecipeCard key={r.id} recipe={r}/>)}
                  </div>
                : <p className="text-center text-gray-500">No recipes yet.</p>
            )}
            {tab==='articles' && (
              userArticles.length
                ? <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {userArticles.map(a=> <ArticleCard key={a.id} article={a}/>)}
                  </div>
                : <p className="text-center text-gray-500">No articles yet.</p>
            )}
            {tab==='videos' && (
              userVideos.length
                ? <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {userVideos.map(v=> <VideoCard key={v.id} video={v}/>)}
                  </div>
                : <p className="text-center text-gray-500">No videos yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
