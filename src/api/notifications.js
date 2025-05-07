import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export function getNotifications() {
  return api.get('/notifications').then(res => res.data)
}
export function markAllRead() {
  return api.put('/notifications/mark-all-read')
}
export function markOneRead(id) {
  return api.put(`/notifications/${id}/mark-read`)
}
export function clearAllNotifications() {
  return api.delete('/notifications/clear')
}
export function deleteOneNotification(id) {
  return api.delete(`/notifications/${id}`)
}
