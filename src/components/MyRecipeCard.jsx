import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiEdit2,
  FiTrash2,
  FiThumbsUp,
  FiMessageCircle
} from 'react-icons/fi'
import {
  useToggleLikeRecipe,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useDeleteRecipe
} from '../hooks/useRecipes'
import { useAuth } from '../context/AuthContext'

export default function MyRecipeCard({ recipe }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: watchlist = [] } = useWatchlist()
  const { mutate: toggleLike } = useToggleLikeRecipe()
  const { mutate: addToWatchlist } = useAddToWatchlist()
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist()
  const { mutate: deleteRecipe } = useDeleteRecipe()

  const liked = useMemo(() => recipe.likedBy.includes(user.email), [recipe, user])
  const saved = useMemo(() => watchlist.some(r => r.id === recipe.id), [watchlist, recipe])

  const onLike = e => {
    e.stopPropagation()
    toggleLike(recipe.id)
  }
  const onBookmark = e => {
    e.stopPropagation()
    saved ? removeFromWatchlist(recipe.id) : addToWatchlist(recipe.id)
  }
  const onEdit = e => {
    e.stopPropagation()
    navigate(`/recipes/edit/${recipe.id}`)
  }
  const onDelete = e => {
    e.stopPropagation()
    if (window.confirm('Delete this recipe?')) {
      deleteRecipe(recipe.id)
    }
  }

  return (
    <div
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition"
    >
      {/* Media + Actions */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        {recipe.photoUrl
          ? <img src={recipe.photoUrl} alt="" className="w-full h-full object-cover" />
          : recipe.videoUrl
            ? <video src={recipe.videoUrl} className="w-full h-full object-cover" muted loop autoPlay />
            : <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Media</div>
        }

        {/* Edit/Delete */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={onEdit} className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
            <FiEdit2 className="text-gray-700" />
          </button>
          <button onClick={onDelete} className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
            <FiTrash2 className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{recipe.topic}</h3>
      <p className="text-sm text-gray-600 mb-4 truncate">by {recipe.uploadedBy}</p>

      {/* Like & Comment */}
      <div className="mt-auto flex items-center justify-between text-gray-600 mb-2">
        <button onClick={onLike} className="flex items-center space-x-1">
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
