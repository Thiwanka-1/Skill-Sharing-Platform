import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiThumbsUp,
  FiMessageCircle,
  FiBookmark,
  FiBookmark as FiBookmarkOutline
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import {
  useToggleLikeArticle,
  useSaveArticle,
  useUnsaveArticle,
  useSavedArticles
} from '../hooks/useArticles'

export default function ArticleCard({ article }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: saved = [] } = useSavedArticles()
  const { mutate: toggleLike } = useToggleLikeArticle()
  const { mutate: save } = useSaveArticle()
  const { mutate: unsave } = useUnsaveArticle()

  const liked = useMemo(
    () => article.likedBy.includes(user?.email),
    [article, user]
  )
  const isSaved = useMemo(
    () => saved.some(a => a.id === article.id),
    [saved, article]
  )

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition"
    >
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={article.photoUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={e => {
            e.stopPropagation()
            isSaved ? unsave(article.id) : save(article.id)
          }}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition
            ${isSaved
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-white bg-opacity-60 text-gray-600 hover:bg-opacity-80'}
          `}
        >
          {isSaved ? (
            <FiBookmark size={20}/>
          ) : (
            <FiBookmarkOutline size={20}/>
          )}
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-1 line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 truncate">
        by {article.uploadedBy}
      </p>
      <div className="mt-auto flex items-center justify-between text-gray-600">
        <button
          onClick={e => { e.stopPropagation(); toggleLike(article.id) }}
          className="flex items-center space-x-1"
        >
          <FiThumbsUp
            className={liked ? 'text-blue-500' : ''}
          />
          <span>{article.likedBy.length}</span>
        </button>
        <div className="flex items-center space-x-1">
          <FiMessageCircle/>
          <span>{article.comments.length}</span>
        </div>
      </div>
    </div>
  )
}
