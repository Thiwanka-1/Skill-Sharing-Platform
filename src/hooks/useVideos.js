// src/hooks/useVideos.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as videoApi from '../api/videos'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8081/api' })
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export function useAllVideos() {
  // only one definition
  return useQuery({ queryKey: ['videos'], queryFn: videoApi.getAllVideos })
}

export function useVideo(id) {
  return useQuery({
    queryKey: ['videos', id],
    queryFn: () => videoApi.getVideo(id)
  })
}

export function useMyVideos() {
  return useQuery({
    queryKey: ['myVideos'],
    queryFn: videoApi.getMyVideos
  })
}

export function useVideoWatchlist() {
  return useQuery({
    queryKey: ['videoWatchlist'],
    queryFn: videoApi.getVideoWatchlist
  })
}

export function useCreateVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.createVideo,
    onSuccess: () => {
      qc.invalidateQueries(['videos'])
      qc.invalidateQueries(['myVideos'])
    },
  })
}

export function useUpdateVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }) => videoApi.updateVideo(id, formData),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries(['videos', id])
      qc.invalidateQueries(['videos'])
      qc.invalidateQueries(['myVideos'])
    },
  })
}

export function useDeleteVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.deleteVideo,
    onSuccess: () => {
      qc.invalidateQueries(['videos'])
      qc.invalidateQueries(['myVideos'])
    },
  })
}

export function useToggleLikeVideo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.toggleLikeVideo,
    onSuccess: (_, id) => {
      qc.invalidateQueries(['videos', id])
      qc.invalidateQueries(['videos'])
      qc.invalidateQueries(['myVideos'])
    },
  })
}

export function useAddVideoComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, text }) => videoApi.addVideoComment(id, text),
    onSuccess: (_, { id }) => qc.invalidateQueries(['videos', id]),
  })
}

export function useUpdateVideoComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, text }) => videoApi.updateVideoComment(commentId, text),
    onSuccess: () => qc.invalidateQueries(['videos']),
  })
}

export function useDeleteVideoComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.deleteVideoComment,
    onSuccess: () => qc.invalidateQueries(['videos']),
  })
}

export function useAddToVideoWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.addToVideoWatchlist,
    onSuccess: () => qc.invalidateQueries(['videoWatchlist']),
  })
}

export function useRemoveFromVideoWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: videoApi.removeFromVideoWatchlist,
    onSuccess: () => qc.invalidateQueries(['videoWatchlist']),
  })
}
