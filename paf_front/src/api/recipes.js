import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Automatically attach JWT from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Recipe endpoints
export const getAllRecipes     = () => api.get('/recipes').then(res => res.data);
export const getRecipe         = id => api.get(`/recipes/${id}`).then(res => res.data);
export const getMyRecipes      = () => api.get('/recipes/mine').then(res => res.data);
export const createRecipe      = formData => api.post('/recipes', formData).then(res => res.data);
export const updateRecipe      = (id, formData) => api.put(`/recipes/${id}`, formData).then(res => res.data);
export const deleteRecipe      = id => api.delete(`/recipes/${id}`).then(res => res.data);
export const toggleLikeRecipe  = id => api.post(`/recipes/${id}/like`).then(res => res.data);
// For comments we’ll send as URLSearchParams so @RequestParam works
export const addRecipeComment  = (id, commentText) => {
  const params = new URLSearchParams();
  params.append('commentText', commentText);
  return api.post(`/recipes/${id}/comments`, params).then(res => res.data);
};
export const updateRecipeComment = (commentId, commentText) => {
  const params = new URLSearchParams();
  params.append('commentText', commentText);
  return api.put(`/recipe-comments/${commentId}`, params).then(res => res.data);
};
export const deleteRecipeComment = commentId =>
  api.delete(`/recipe-comments/${commentId}`).then(res => res.data);

// Watchlist
export const addToWatchlist    = id => api.post(`/watchlist/add/${id}`).then(res => res.data);
export const removeFromWatchlist = id => api.post(`/watchlist/remove/${id}`).then(res => res.data);
export const getWatchlist      = () => api.get('/watchlist').then(res => res.data);
