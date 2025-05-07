import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export const getAllVideos         = () => api.get('/videos').then(r => r.data)
export const getVideo             = id => api.get(`/videos/${id}`).then(r => r.data)
export const getMyVideos          = () => api.get('/videos/mine').then(r => r.data)
export const createVideo          = fd => api.post('/videos', fd).then(r => r.data)
export const updateVideo          = (id, fd) => api.put(`/videos/${id}`, fd).then(r => r.data)
export const deleteVideo          = id => api.delete(`/videos/${id}`).then(r => r.data)
export const toggleLikeVideo      = id => api.post(`/videos/${id}/like`).then(r => r.data)
export const addVideoComment      = (id, text) => {
  const p = new URLSearchParams(); p.append('commentText', text)
  return api.post(`/videos/${id}/comments`, p).then(r => r.data)
}
export const updateVideoComment   = (cid, text) => {
  const p = new URLSearchParams(); p.append('commentText', text)
  return api.put(`/video-comments/${cid}`, p).then(r => r.data)
}
export const deleteVideoComment   = cid => api.delete(`/video-comments/${cid}`).then(r => r.data)
export const addToVideoWatchlist  = id => api.post(`/video-watchlist/add/${id}`).then(r => r.data)
export const removeFromVideoWatchlist = id => api.post(`/video-watchlist/remove/${id}`).then(r => r.data)
export const getVideoWatchlist    = () => api.get('/video-watchlist').then(r => r.data)
