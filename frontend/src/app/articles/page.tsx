'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Article = {
  id: number
  user_id: number
  title: string
  body: string
  created_at: string
}

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('http://localhost:8080/articles', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setArticles(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight">Newsletter</h1>
        <button
          onClick={() => router.push('/articles/new')}
          className="text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
        >
          記事を書く
        </button>
      </header>

      <main className="max-w-2xl mx-auto mt-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-sm font-medium text-gray-400">記事一覧</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs text-gray-400 hover:text-black transition-colors"
          >
            ← 戻る
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">まだ記事がありません</p>
            <button
              onClick={() => router.push('/articles/new')}
              className="mt-4 text-xs text-black underline"
            >
              最初の記事を書く
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {articles.map((article) => (
              <div key={article.id} className="py-4 border-b">
                <p className="text-sm font-medium">{article.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(article.created_at).toLocaleDateString('ja-JP')}
                </p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.body}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}