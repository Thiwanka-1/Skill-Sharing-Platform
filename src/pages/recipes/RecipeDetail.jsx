import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  FiThumbsUp,
  FiMessageCircle,
  FiBookmark,
  FiBookmark as FiBookmarkOutline,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi'
import {
  useRecipe,
  useToggleLikeRecipe,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useAddRecipeComment,
  useUpdateRecipeComment,
  useDeleteRecipeComment
} from '../../hooks/useRecipes'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

export default function RecipeDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  // —— Data & Hooks ——  
  const {
    data: recipe,
    isLoading,
    isError,
    error,
    refetch
  } = useRecipe(id)

  const { data: watchlist = [] } = useWatchlist()

  const { mutate: toggleLike } = useToggleLikeRecipe()
  const { mutate: addToWatchlist } = useAddToWatchlist()
  const { mutate: removeFromWatchlist } = useRemoveFromWatchlist()

  // Use async versions of the comment mutations
  const { mutateAsync: addCommentAsync }    = useAddRecipeComment()
  const { mutateAsync: updateCommentAsync } = useUpdateRecipeComment()
  const { mutateAsync: deleteCommentAsync } = useDeleteRecipeComment()

  const [newComment, setNewComment] = useState('')
  const [editId,    setEditId]      = useState(null)
  const [editText,  setEditText]    = useState('')

  // —— Derived Flags ——  
  const liked = useMemo(() => recipe?.likedBy.includes(user.email), [recipe, user])
  const saved = useMemo(() => recipe && watchlist.some(r => r.id === recipe.id), [watchlist, recipe])

  // —— Conditional UI ——  
  if (isLoading) return <div className="p-12 text-center text-lg">Loading…</div>
  if (isError)   return <div className="p-12 text-center text-red-600">Error: {error.message}</div>
  if (!recipe)   return <div className="p-12 text-center text-gray-500">Recipe not found</div>

  // —— Handlers ——  
  const handleLike     = () => toggleLike(recipe.id)
  const handleBookmark = () => saved ? removeFromWatchlist(recipe.id) : addToWatchlist(recipe.id)

  const handleAddComment = async () => {
    const txt = newComment.trim()
    if (!txt) return
    await addCommentAsync({ id: recipe.id, text: txt })
    setNewComment('')
    refetch()
  }

  const startEdit = c => {
    setEditId(c.id)
    setEditText(c.commentText)
  }

  const submitEdit = async () => {
    const txt = editText.trim()
    if (!txt) return
    await updateCommentAsync({ commentId: editId, text: txt })
    setEditId(null)
    setEditText('')
    refetch()
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }

  const handleDelete = async cid => {
    await deleteCommentAsync(cid)
    refetch()
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
          <Sidebar />
    <main className="flex-1 p-8 max-w-3xl mx-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Media */}
        <div className="relative h-0 pb-[56.25%]">{/* 16:9 */}
          {recipe.photoUrl ? (
            <img
              src={recipe.photoUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : recipe.videoUrl ? (
            <video
              src={recipe.videoUrl}
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No media</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title & Meta */}
          <div>
            <h1 className="text-4xl font-bold">{recipe.topic}</h1>
            <p className="text-gray-500 mt-1">
              by <span className="font-semibold">{recipe.uploadedBy}</span> &bull;{' '}
              <time className="italic">
                {new Date(recipe.createdAt).toLocaleString()}
              </time>
            </p>
          </div>

          {/* Description */}
          <p className="text-lg leading-relaxed text-gray-700">{recipe.description}</p>

          {/* Actions */}
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                liked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              } transition`}
            >
              <FiThumbsUp size={24} />
              <span className="text-xl">{recipe.likedBy.length}</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 ${
                saved ? 'text-green-500' : 'text-gray-600 hover:text-green-500'
              } transition`}
            >
              {saved ? <FiBookmark size={24} /> : <FiBookmarkOutline size={24} />}
              <span className="text-xl">{saved ? 'Saved' : 'Save'}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-600">
              <FiMessageCircle size={24} />
              <span className="text-xl">{recipe.comments.length}</span>
            </div>
          </div>

          {/* Comments */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>

            {/* New Comment */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Post
              </button>
            </div>

            {/* List of Comments */}
            <ul className="space-y-6">
              {recipe.comments.map(c => (
                <li key={c.id} className="border-t pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold">{c.commenter}</p>
                      {editId === c.id ? (
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      ) : (
                        <p className="text-gray-700">{c.commentText}</p>
                      )}
                    </div>
                    {c.commenter === user.email && (
                      <div className="flex flex-col space-y-2 ml-4">
                        {editId === c.id ? (
                          <>
                            <button
                              onClick={submitEdit}
                              className="text-green-600 hover:text-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(c)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
    </div>
  )
}
