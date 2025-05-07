import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiThumbsUp, FiMessageCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import {
  useToggleLikeArticle,
  useSavedArticles,
  useSaveArticle,
  useUnsaveArticle,
  useDeleteArticle
} from '../hooks/useArticles'

export default function MyArticleCard({ article }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: saved = [] } = useSavedArticles()
  const { mutate: toggleLike } = useToggleLikeArticle()
  const { mutate: save } = useSaveArticle()
  const { mutate: unsave } = useUnsaveArticle()
  const { mutate: deleteArticle } = useDeleteArticle()

  const liked = useMemo(
    () => article.likedBy.includes(user.email),
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
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={e => { e.stopPropagation(); navigate(`/articles/edit/${article.id}`) }}
            className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100"
          >
            <FiEdit2 className="text-gray-700"/>
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              if (window.confirm('Delete this article?')) deleteArticle(article.id)
            }}
            className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100"
          >
            <FiTrash2 className="text-red-600"/>
          </button>
        </div>
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
          <FiThumbsUp className={liked ? 'text-blue-500' : ''}/>
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
