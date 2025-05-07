import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiThumbsUp, FiMessageCircle } from 'react-icons/fi'
import {
  useToggleLikeVideo,
  useVideoWatchlist,
  useAddToVideoWatchlist,
  useRemoveFromVideoWatchlist,
  useDeleteVideo
} from '../hooks/useVideos'
import { useAuth } from '../context/AuthContext'

export default function MyVideoCard({ video }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: watchlist = [] } = useVideoWatchlist()
  const { mutate: toggleLike } = useToggleLikeVideo()
  const { mutate: addWatch } = useAddToVideoWatchlist()
  const { mutate: removeWatch } = useRemoveFromVideoWatchlist()
  const { mutate: deleteVideo } = useDeleteVideo()

  const liked = useMemo(() => video.likedBy.includes(user.email), [video, user])
  const saved = useMemo(() => watchlist.some(v => v.id === video.id), [watchlist, video])

  return (
    <div
      onClick={()=>navigate(`/videos/${video.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition"
    >
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <video src={video.videoUrl} className="w-full h-full object-cover" muted loop autoPlay/>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={e=>{e.stopPropagation();navigate(`/videos/edit/${video.id}`)}} className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
            <FiEdit2 className="text-gray-700"/>
          </button>
          <button onClick={e=>{e.stopPropagation(); if(window.confirm('Delete?')) deleteVideo(video.id)}} className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
            <FiTrash2 className="text-red-600"/>
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{video.title}</h3>
      <p className="text-sm text-gray-600 mb-4 truncate">by {video.uploadedBy}</p>
      <div className="mt-auto flex items-center justify-between text-gray-600">
        <button onClick={e=>{e.stopPropagation();toggleLike(video.id)}} className="flex items-center space-x-1">
          <FiThumbsUp className={liked?'text-blue-500':''}/>
          <span>{video.likedBy.length}</span>
        </button>
        <div className="flex items-center space-x-1">
          <FiMessageCircle/>
          <span>{video.comments.length}</span>
        </div>
      </div>
    </div>
  )
}
