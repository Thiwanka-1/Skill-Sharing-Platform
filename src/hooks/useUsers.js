// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then(r => r.data),
  })
}

export function useFollowUser() {
  const qc = useQueryClient()
  const { user: me } = useAuth()

  return useMutation({
    mutationFn: id => api.post(`/users/follow/${id}`),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['user', id] })      // refetch the *other* user
      qc.invalidateQueries({ queryKey: ['user', me.id] })   // refetch yourself if you care
    }
  })
}

export function useUnfollowUser() {
  const qc = useQueryClient()
  const { user: me } = useAuth()

  return useMutation({
    mutationFn: id => api.post(`/users/unfollow/${id}`),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['user', id] })
      qc.invalidateQueries({ queryKey: ['user', me.id] })
    }
  })
}


export function useUserByEmail(email) {
  return useQuery({
    queryKey: ['userByEmail', email],
    queryFn: () =>
      api
        .get(`/users/by-email?email=${encodeURIComponent(email)}`)
        .then(res => res.data),
    enabled: !!email,   // only run when email is non‐empty
  })
}