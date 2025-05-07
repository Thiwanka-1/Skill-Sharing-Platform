// src/api/index.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true,
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})
