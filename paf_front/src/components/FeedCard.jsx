// src/components/FeedCard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiThumbsUp,
  FiMessageCircle,
  FiBookmark,
  FiBookmark as FiBookmarkOutline,
  FiSend
} from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

import { useAuth } from '../context/AuthContext'
import { useUserByEmail } from '../hooks/useUsers'

// recipe hooks
import {
  useToggleLikeRecipe,
  useAddRecipeComment,
  useAddToWatchlist,
  useRemoveFromWatchlist
} from '../hooks/useRecipes'
// article hooks
import {
  useToggleLikeArticle,
  useAddArticleComment,
  useSaveArticle,
  useUnsaveArticle
} from '../hooks/useArticles'
// video hooks
import {
  useToggleLikeVideo,
  useAddVideoComment,
  useAddToVideoWatchlist,
  useRemoveFromVideoWatchlist
} from '../hooks/useVideos'

export default function FeedCard({ item, type }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // fetch uploader info by email
  const { data: uploader, isLoading: uLoading } = useUserByEmail(item.uploadedBy)

  // comment section toggling
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment]   = useState('')

  // pick the right mutations & state based on type
  let liked, saved, comments, handleLike, handleSave, handleAddComment

  if (type === 'RECIPE') {
    const { mutate: toggleLike }     = useToggleLikeRecipe()
    const { mutate: addToWL }        = useAddToWatchlist()
    const { mutate: removeFromWL }   = useRemoveFromWatchlist()
    const { mutate: addComment }     = useAddRecipeComment()

    liked           = item.likedBy.includes(user?.email)
    saved           = false              // implement your own watchlist hook if needed
    comments        = item.comments
    handleLike      = () => toggleLike(item.id)
    handleSave      = () => saved ? removeFromWL(item.id) : addToWL(item.id)
    handleAddComment= txt => addComment({ id: item.id, text: txt })
  }
  else if (type === 'ARTICLE') {
    const { mutate: toggleLike }     = useToggleLikeArticle()
    const { mutate: save }           = useSaveArticle()
    const { mutate: unsave }         = useUnsaveArticle()
    const { mutate: addComment }     = useAddArticleComment()

    liked           = item.likedBy.includes(user?.email)
    saved           = item.savedBy?.includes(user?.email)    
    comments        = item.comments
    handleLike      = () => toggleLike(item.id)
    handleSave      = () => saved ? unsave(item.id) : save(item.id)
    handleAddComment= txt => addComment({ id: item.id, text: txt })
  }
  else /* VIDEO */ {
    const { mutate: toggleLike }     = useToggleLikeVideo()
    const { mutate: addToWL }        = useAddToVideoWatchlist()
    const { mutate: removeFromWL }   = useRemoveFromVideoWatchlist()
    const { mutate: addComment }     = useAddVideoComment()

    liked           = item.likedBy.includes(user?.email)
    saved           = false              // implement your own watchlist hook if needed
    comments        = item.comments
    handleLike      = () => toggleLike(item.id)
    handleSave      = () => saved ? removeFromWL(item.id) : addToWL(item.id)
    handleAddComment= txt => addComment({ id: item.id, text: txt })
  }

  const toggleComments = () => setShowComments(v => !v)
  const postComment   = () => {
    const t = newComment.trim()
    if (!t) return
    handleAddComment(t)
    setNewComment('')
  }

  return (
    <div className="bg-white rounded-2xl shadow mb-8 overflow-hidden">
      {/* --- Header: uploader avatar, name, timestamp, details link --- */}
      <div className="flex items-center p-4">
        <img
          src={uploader?.profilePicUrl || 'https://via.placeholder.com/40'}
          alt={uploader?.username}
          className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer"
          onClick={() => uploader && navigate(`/users/${uploader.id}`)}
        />
        <div className="flex-1">
          <button
            className="font-semibold hover:underline"
            onClick={() => uploader && navigate(`/users/${uploader.id}`)}
          >
            {uploader?.username || item.uploadedBy}
          </button>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </div>
        </div>
        <button
          className="text-sm text-blue-600"
          onClick={() => navigate(`/${type.toLowerCase()}s/${item.id}`)}
        >
          View details
        </button>
      </div>

      {/* --- Media or Photo --- */}
      {type === 'RECIPE' && item.photoUrl && (
        <img src={item.photoUrl} alt="" className="w-full object-cover max-h-96" />
      )}
      {type === 'ARTICLE' && item.photoUrl && (
        <img src={item.photoUrl} alt="" className="w-full object-cover max-h-96" />
      )}
      {type === 'VIDEO' && item.videoUrl && (
        <video src={item.videoUrl} controls className="w-full object-cover max-h-96" />
      )}

      {/* --- Body & Actions --- */}
      <div className="p-4 space-y-3">
        <p className="text-gray-800 font-medium">
          {item.title || item.topic}
        </p>
        <p className="text-gray-600 text-sm">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-gray-600">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 hover:text-blue-600 ${
              liked ? 'text-blue-600' : ''
            }`}
          >
            <FiThumbsUp />
            <span>{item.likedBy.length}</span>
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <FiMessageCircle />
            <span>{comments.length}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            {saved ? <FiBookmark /> : <FiBookmarkOutline />}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* --- Comments Section (toggleable) --- */}
        {showComments && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {comments.map(c => (
              <div key={c.id} className="flex items-start space-x-2">
                <div>
                  <p className="font-semibold text-sm">{c.commenter}</p>
                  <p className="text-sm">{c.commentText}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 p-2 border rounded-full focus:outline-none text-sm"
              />
              <button
                onClick={postComment}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
