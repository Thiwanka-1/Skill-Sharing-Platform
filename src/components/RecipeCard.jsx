import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiThumbsUp,
  FiMessageCircle,
  FiBookmark,
  FiBookmark as FiBookmarkOutline
} from 'react-icons/fi'
import {
  useToggleLikeRecipe,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist
} from '../hooks/useRecipes'
import { useAuth } from '../context/AuthContext'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: watchlist = [] } = useWatchlist()
  const { mutate: toggleLike } = useToggleLikeRecipe()
  const { mutate: addToWatchlist } = useAddToWatchlist()
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist()

  // Has current user liked this?
  const liked = useMemo(
    () => recipe.likedBy.includes(user?.email),
    [recipe.likedBy, user]
  )
  // Is this recipe in the watchlist?
  const saved = useMemo(
    () => watchlist.some(r => r.id === recipe.id),
    [watchlist, recipe.id]
  )

  const handleLike = e => {
    e.stopPropagation()
    toggleLike(recipe.id)
  }
  const handleBookmark = e => {
    e.stopPropagation()
    if (saved) removeFromWatchlist(recipe.id)
    else addToWatchlist(recipe.id)
  }

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition"
    >
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        {recipe.photoUrl ? (
          <img
            src={recipe.photoUrl}
            alt={recipe.topic}
            className="w-full h-full object-cover"
          />
        ) : recipe.videoUrl ? (
          <video
            src={recipe.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Media
          </div>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`
            absolute top-2 right-2 p-2 rounded-full 
            transition 
            ${saved 
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
              : 'bg-white bg-opacity-60 text-gray-600 hover:bg-opacity-80'}
          `}
        >
          {saved ? <FiBookmark size={20}/> : <FiBookmarkOutline size={20}/>}
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{recipe.topic}</h3>
      <p className="text-sm text-gray-600 mb-4 truncate">by {recipe.uploadedBy}</p>

      <div className="mt-auto flex items-center justify-between text-gray-600">
        <button onClick={handleLike} className="flex items-center space-x-1">
          <FiThumbsUp className={liked ? 'text-blue-500' : ''} />
          <span>{recipe.likedBy.length}</span>
        </button>
        <div className="flex items-center space-x-1">
          <FiMessageCircle />
          <span>{recipe.comments.length}</span>
        </div>
      </div>
    </div>
  )
}
