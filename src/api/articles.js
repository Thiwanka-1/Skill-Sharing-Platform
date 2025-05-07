import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export const getAllArticles       = () => api.get('/articles').then(r => r.data)
export const getArticle           = id => api.get(`/articles/${id}`).then(r => r.data)
export const getMyArticles        = () => api.get('/articles/mine').then(r => r.data)
export const createArticle        = fd => api.post('/articles', fd).then(r => r.data)
export const updateArticle        = (id, fd) => api.put(`/articles/${id}`, fd).then(r => r.data)
export const deleteArticle        = id => api.delete(`/articles/${id}`).then(r => r.data)
export const toggleLikeArticle    = id => api.post(`/articles/${id}/like`).then(r => r.data)
export const addArticleComment    = (id, text) => {
  const p = new URLSearchParams(); p.append('commentText', text)
  return api.post(`/articles/${id}/comments`, p).then(r => r.data)
}
export const updateArticleComment = (cid, text) => {
  const p = new URLSearchParams(); p.append('commentText', text)
  return api.put(`/article-comments/${cid}`, p).then(r => r.data)
}
export const deleteArticleComment = cid => api.delete(`/article-comments/${cid}`).then(r => r.data)
export const saveArticle          = id => api.post(`/saved-articles/add/${id}`).then(r => r.data)
export const unsaveArticle        = id => api.post(`/saved-articles/remove/${id}`).then(r => r.data)
export const getSavedArticles     = () => api.get('/saved-articles').then(r => r.data)
