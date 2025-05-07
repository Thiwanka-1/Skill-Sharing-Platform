// src/pages/videos/VideoDetail.jsx
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
  useVideo,
  useToggleLikeVideo,
  useVideoWatchlist,
  useAddToVideoWatchlist,
  useRemoveFromVideoWatchlist,
  useAddVideoComment,
  useUpdateVideoComment,
  useDeleteVideoComment
} from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'

export default function VideoDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  // === ALL HOOKS AT TOP ===
  const { data: video, isLoading, isError, error } = useVideo(id)
  const { data: watchlist = [] } = useVideoWatchlist()
  const { mutate: toggleLike } = useToggleLikeVideo()
  const { mutate: addWatch } = useAddToVideoWatchlist()
  const { mutate: removeWatch } = useRemoveFromVideoWatchlist()
  const { mutate: addComment } = useAddVideoComment()
  const { mutate: updateComment } = useUpdateVideoComment()
  const { mutate: deleteComment } = useDeleteVideoComment()

  const [newComment, setNewComment] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')

  // safe defaults even if video is undefined
  const liked = useMemo(
    () => !!video && video.likedBy.includes(user.email),
    [video, user.email]
  )
  const saved = useMemo(
    () => !!video && watchlist.some(v => v.id === video.id),
    [watchlist, video]
  )

  // === HANDLERS ===
  const handleLike = () => toggleLike(video.id)
  const handleBookmark = () =>
    saved ? removeWatch(video.id) : addWatch(video.id)

  const handleAddComment = () => {
    const text = newComment.trim()
    if (!text) return
    addComment({ id: video.id, text })
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

  // === EARLY RENDERS ===
  if (isLoading) {
    return <div className="p-8 text-center">Loading…</div>
  }
  if (isError) {
    return (
      <div className="p-8 text-red-600 text-center">
        {error.message}
      </div>
    )
  }
  if (!video) return null

  // format dates
  const uploadedDate = new Date(video.createdAt).toLocaleDateString()
  const updatedDate =
    video.updatedAt && video.updatedAt !== video.createdAt
      ? new Date(video.updatedAt).toLocaleDateString()
      : null

  // === MAIN RENDER ===
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl mx-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Video Player */}
        <div className="mb-6  overflow-hidden">
          <video
            src={video.videoUrl}
            controls
            className="w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <p className="text-gray-600 text-sm mb-2">
          Uploaded by <span className="font-medium">{video.uploadedBy}</span> on{' '}
          {uploadedDate}
          {updatedDate && (
            <> · Updated on <span className="font-medium">{updatedDate}</span></>
          )}
        </p>
        <p className="mb-6">{video.description}</p>

        {/* Actions */}
        <div className="flex items-center space-x-6 mb-8 text-gray-700">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1"
          >
            <FiThumbsUp
              className={liked ? 'text-blue-500' : ''}
              size={20}
            />
            <span>{video.likedBy.length}</span>
          </button>

          <button
            onClick={handleBookmark}
            className="flex items-center space-x-1"
          >
            {saved ? (
              <FiBookmark size={20} />
            ) : (
              <FiBookmarkOutline size={20} />
            )}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="flex items-center space-x-1">
            <FiMessageCircle size={20} />
            <span>{video.comments.length}</span>
          </div>
        </div>
        </div>
        {/* Comments Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Comments
          </h2>

          {/* New Comment */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Post
            </button>
          </div>

          {/* Existing Comments */}
          <ul className="space-y-4">
            {video.comments.map(c => (
              <li key={c.id} className="border-t pt-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {c.commenter}
                    </p>

                    {editId === c.id ? (
                      <textarea
                        value={editText}
                        onChange={e =>
                          setEditText(e.target.value)
                        }
                        className="w-full p-2 border rounded mb-2"
                      />
                    ) : (
                      <p>{c.commentText}</p>
                    )}
                  </div>

                  {c.commenter === user.email && (
                    <div className="flex space-x-2 ml-4">
                      {editId === c.id ? (
                        <>
                          <button
                            onClick={submitEdit}
                            className="text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(c)}
                            className="text-blue-600"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => doDelete(c.id)}
                            className="text-red-600"
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
      </main>
    </div>
  )
}
