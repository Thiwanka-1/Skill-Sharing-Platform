import React, { useMemo } from 'react'
import { useAllRecipes }  from '../hooks/useRecipes'
import { useAllArticles } from '../hooks/useArticles'
import { useAllVideos }   from '../hooks/useVideos'
import FeedCard           from '../components/FeedCard'
import Sidebar            from '../components/Sidebar'

export default function Home() {
  const { data: recipes = [],  isLoading: rLoading } = useAllRecipes()
  const { data: articles = [], isLoading: aLoading } = useAllArticles()
  const { data: videos   = [], isLoading: vLoading } = useAllVideos()

  const loading = rLoading || aLoading || vLoading

  // merge & sort by date desc
  const feed = useMemo(() => {
    const tagged = [
      ...recipes.map(r => ({ ...r, __type: 'RECIPE' })),
      ...articles.map(a => ({ ...a, __type: 'ARTICLE' })),
      ...videos.map(v => ({ ...v, __type: 'VIDEO' }))
    ]
    return tagged.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [recipes, articles, videos])

  if (loading) {
    return <div className="p-8 text-center">Loading feed…</div>
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-3xl mx-auto p-6">
        {feed.length === 0 && (
          <p className="text-center text-gray-500 mt-20">No posts yet.</p>
        )}
        {feed.map(post => (
          <FeedCard
            key={`${post.__type}-${post.id}`}
            item={post}
            type={post.__type}
          />
        ))}
      </main>
    </div>
  )
}
