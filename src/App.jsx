import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import Header from './components/Header';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import CreateRecipeTester from './pages/CreateRecipeTester';

import Recipes from './pages/recipes/Recipes';
import RecipeDetail from './pages/recipes/RecipeDetail';
import RecipeForm from './pages/recipes/RecipeForm';
import MyRecipes from './pages/recipes/MyRecipes'
import RecipeEditForm from './pages/recipes/RecipeEditForm'
import SavedRecipes from './pages/recipes/SavedRecipes'

import Videos from './pages/videos/Videos'
import VideoDetail from './pages/videos/VideoDetail'
import VideoForm from './pages/videos/VideoForm'
import MyVideos from './pages/videos/MyVideos'
import VideoEditForm from './pages/videos/VideoEditForm'
import SavedVideos from './pages/videos/SavedVideos'

import Articles from './pages/articles/Articles'
import ArticleForm from './pages/articles/ArticleForm'
import ArticleDetail from './pages/articles/ArticleDetail'
import ArticleEditForm from './pages/articles/ArticleEditForm'
import MyArticles from './pages/articles/MyArticles'
import SavedArticles from './pages/articles/SavedArticles'

import UserProfile from './pages/user/UserProfile'

import Home from './pages/Home';
function App() {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  return( <>
  <Header />
    <Routes>
      
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      <Route path="/recipes" element={<Recipes />} /> 
      <Route path="/test" element={<CreateRecipeTester />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/recipes/my"      element={<MyRecipes />} />
      <Route path="/recipes/new"     element={<RecipeForm />} />
      <Route path="/recipes/edit/:id" element={<RecipeEditForm />} />
      <Route path="/recipes/saved" element={<SavedRecipes />} />

      {/* cooking videos */}
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/new" element={<VideoForm />} />
      <Route path="/videos/:id" element={<VideoDetail />} />
      <Route path="/videos/edit/:id" element={<VideoEditForm />} />
      <Route path="/videos/saved" element={<SavedVideos />} />
      <Route path="/videos/my" element={<MyVideos />} />

      {/* Articles */}
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/new" element={<ArticleForm />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/articles/edit/:id" element={<ArticleEditForm />} />
      <Route path="/articles/my" element={<MyArticles />} />
      <Route path="/articles/saved" element={<SavedArticles />} />

      <Route path="/users/:id" element={<UserProfile />} />
      <Route path="/" element={<Home />} />

      {/* Admin routes */}

      <Route
        path="/profile"
        element={token && !roles.includes('ROLE_ADMIN') ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/admin/profile"
        element={token && roles.includes('ROLE_ADMIN') ? <AdminProfile /> : <Navigate to="/signin" />}
      />
      {/* other routes… */}
      <Route path="*" element={<Navigate to={token ? (roles.includes('ROLE_ADMIN') ? '/admin/profile' : '/profile') : '/signin'} />} />
    </Routes>
    </>
  );
}


export default App
