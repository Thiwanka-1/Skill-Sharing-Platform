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
import Sidebar from '../../components/Sidebar'
import {
  useArticle,
  useToggleLikeArticle,
  useSavedArticles,
  useSaveArticle,
  useUnsaveArticle,
  useAddArticleComment,
  useUpdateArticleComment,
  useDeleteArticleComment
} from '../../hooks/useArticles'
import { useAuth } from '../../context/AuthContext'

export default function ArticleDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: article, isLoading, isError, error } = useArticle(id)
  const { data: saved = [] } = useSavedArticles()
  const { mutate: toggleLike } = useToggleLikeArticle()
  const { mutate: save } = useSaveArticle()
  const { mutate: unsave } = useUnsaveArticle()
  const { mutate: addComment } = useAddArticleComment()
  const { mutate: updateComment } = useUpdateArticleComment()
  const { mutate: deleteComment } = useDeleteArticleComment()

  const [newComment, setNewComment] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  const liked = useMemo(
    () => !!article && article.likedBy.includes(user.email),
    [article, user.email]
  )
  const isSaved = useMemo(
    () => !!article && saved.some(a => a.id === article.id),
    [saved, article]
  )

  const handleLike = () => toggleLike(article.id)
  const handleBookmark = () =>
    isSaved ? unsave(article.id) : save(article.id)

  const handleAddComment = () => {
    const text = newComment.trim()
    if (!text) return
    addComment({ id: article.id, text })
    setNewComment('')
  }

  const startEdit = c => {
    setEditId(c.id)
    setEditText(c.commentText)
  }
  const submitEdit = () => {
    const text = editText.trim()
    if (!text) return
    updateComment({ commentId: editId, text })
    setEditId(null)
    setEditText('')
  }
  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }
  const doDelete = cid => deleteComment(cid)

  if (isLoading) return <div className="p-8 text-center">Loading…</div>
  if (isError)   return <div className="p-8 text-red-600 text-center">{error.message}</div>
  if (!article) return null

  const uploadedDate = new Date(article.createdAt).toLocaleDateString()
  const updatedDate =
    article.updatedAt !== article.createdAt
      ? new Date(article.updatedAt).toLocaleDateString()
      : null

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl mx-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        <img
          src={article.photoUrl}
          alt={article.title}
          className="mb-6 w-full object-cover"
        />
<div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="text-gray-600 text-sm mb-2">
          by <span className="font-medium">{article.uploadedBy}</span> on{' '}
          {uploadedDate}
          {updatedDate && <> · Updated on <span className="font-medium">{updatedDate}</span></>}
        </p>
        <p className="mb-6">{article.description}</p>

        <div className="flex items-center space-x-6 mb-8 text-gray-700">
          <button onClick={handleLike} className="flex items-center space-x-1">
            <FiThumbsUp className={liked?'text-blue-500':''} size={20}/>
            <span>{article.likedBy.length}</span>
          </button>

          <button onClick={handleBookmark} className="flex items-center space-x-1">
            {isSaved ? <FiBookmark size={20}/> : <FiBookmarkOutline size={20}/>}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="flex items-center space-x-1">
            <FiMessageCircle size={20}/>
            <span>{article.comments.length}</span>
          </div>
        </div>
        </div>
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={e=>setNewComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 p-2 border rounded"
            />
            <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 rounded">
              Post
            </button>
          </div>

          <ul className="space-y-4">
            {article.comments.map(c => (
              <li key={c.id} className="border-t pt-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{c.commenter}</p>
                    {editId===c.id ? (
                      <textarea
                        value={editText}
                        onChange={e=>setEditText(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      />
                    ) : (
                      <p>{c.commentText}</p>
                    )}
                  </div>
                  {c.commenter===user.email && (
                    <div className="flex space-x-2 ml-4">
                      {editId===c.id ? (
                        <>
                          <button onClick={submitEdit} className="text-green-600">Save</button>
                          <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(c)} className="text-blue-600"><FiEdit2/></button>
                          <button onClick={()=>doDelete(c.id)} className="text-red-600"><FiTrash2/></button>
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
      </main>
    </div>
  )
}
