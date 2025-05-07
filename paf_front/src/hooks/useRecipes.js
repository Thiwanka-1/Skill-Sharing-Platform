// src/hooks/useRecipes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as recipesApi from '../api/recipes'

export function useAllRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: recipesApi.getAllRecipes,
  })
}

export function useMyRecipes() {
  return useQuery({
    queryKey: ['myRecipes'],
    queryFn: recipesApi.getMyRecipes,
  })
}

export function useCreateRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.createRecipe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      qc.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })
}

export function useUpdateRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }) => recipesApi.updateRecipe(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      qc.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })
}

export function useDeleteRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.deleteRecipe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      qc.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })
}

export function useToggleLikeRecipe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.toggleLikeRecipe,
    onSuccess: (_, recipeId) => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
      qc.invalidateQueries({ queryKey: ['recipes', recipeId] })
      qc.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })
}

export function useAddRecipeComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, text }) => recipesApi.addRecipeComment(id, text),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['recipes', id] })
      qc.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })
}

export function useUpdateRecipeComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, text }) =>
      recipesApi.updateRecipeComment(commentId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useDeleteRecipeComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.deleteRecipeComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: recipesApi.getWatchlist,
  })
}

export function useAddToWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.addToWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: recipesApi.removeFromWatchlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

export function useRecipe(id) {
  return useQuery({
    queryKey: ['recipes', id],
    queryFn: () => recipesApi.getRecipe(id),
  })
}