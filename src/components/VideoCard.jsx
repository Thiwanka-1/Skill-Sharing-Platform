import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiThumbsUp,
  FiMessageCircle,
  FiBookmark,
  FiBookmark as FiBookmarkOutline
} from 'react-icons/fi'
import {
  useToggleLikeVideo,
  useAddToVideoWatchlist,
  useRemoveFromVideoWatchlist,
  useVideoWatchlist
} from '../hooks/useVideos'
import { useAuth } from '../context/AuthContext'

export default function VideoCard({ video }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: watchlist = [] } = useVideoWatchlist()
  const { mutate: toggleLike } = useToggleLikeVideo()
  const { mutate: addToWatch } = useAddToVideoWatchlist()
  const { mutate: removeFromWatch } = useRemoveFromVideoWatchlist()

  const liked = useMemo(() => video.likedBy.includes(user?.email), [video, user])
  const saved = useMemo(() => watchlist.some(v => v.id === video.id), [watchlist, video])

  return (
    <div
      onClick={() => navigate(`/videos/${video.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition"
    >
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <video
          src={video.videoUrl}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
        />
        <button
          onClick={e => { e.stopPropagation(); saved ? removeFromWatch(video.id) : addToWatch(video.id) }}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition 
            ${saved 
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-white bg-opacity-60 text-gray-600 hover:bg-opacity-80'}
          `}
        >
          {saved ? <FiBookmark size={20}/> : <FiBookmarkOutline size={20}/>}
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{video.title}</h3>
      <p className="text-sm text-gray-600 mb-4">by {video.uploadedBy}</p>
      <div className="mt-auto flex items-center justify-between text-gray-600">
        <button onClick={e => { e.stopPropagation(); toggleLike(video.id) }} className="flex items-center space-x-1">
          <FiThumbsUp className={liked ? 'text-blue-500' : ''}/>
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
