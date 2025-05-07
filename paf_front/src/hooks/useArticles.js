// src/hooks/useArticles.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as artApi from '../api/articles'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8081/api' })
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export function useAllArticles() {
  // only one definition
  return useQuery({ queryKey: ['articles'], queryFn: artApi.getAllArticles })
}

export function useArticle(id) {
  return useQuery({
    queryKey: ['articles', id],
    queryFn: () => artApi.getArticle(id)
  })
}

export function useMyArticles() {
  return useQuery({
    queryKey: ['myArticles'],
    queryFn: artApi.getMyArticles
  })
}

export function useSavedArticles() {
  return useQuery({
    queryKey: ['savedArticles'],
    queryFn: artApi.getSavedArticles
  })
}

export function useCreateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.createArticle,
    onSuccess: () => {
      qc.invalidateQueries(['articles'])
      qc.invalidateQueries(['myArticles'])
    },
  })
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }) => artApi.updateArticle(id, formData),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries(['articles', id])
      qc.invalidateQueries(['articles'])
      qc.invalidateQueries(['myArticles'])
    },
  })
}

export function useDeleteArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.deleteArticle,
    onSuccess: () => {
      qc.invalidateQueries(['articles'])
      qc.invalidateQueries(['myArticles'])
    },
  })
}

export function useToggleLikeArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.toggleLikeArticle,
    onSuccess: (_, id) => {
      qc.invalidateQueries(['articles', id])
      qc.invalidateQueries(['articles'])
      qc.invalidateQueries(['myArticles'])
    },
  })
}

export function useAddArticleComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, text }) => artApi.addArticleComment(id, text),
    onSuccess: (_, { id }) => qc.invalidateQueries(['articles', id]),
  })
}

export function useUpdateArticleComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, text }) => artApi.updateArticleComment(commentId, text),
    onSuccess: () => qc.invalidateQueries(['articles']),
  })
}

export function useDeleteArticleComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.deleteArticleComment,
    onSuccess: () => qc.invalidateQueries(['articles']),
  })
}

export function useSaveArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.saveArticle,
    onSuccess: () => qc.invalidateQueries(['savedArticles']),
  })
}

export function useUnsaveArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: artApi.unsaveArticle,
    onSuccess: () => qc.invalidateQueries(['savedArticles']),
  })
}
