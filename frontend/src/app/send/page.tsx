'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

type Article = {
  id: number
  title: string
  body: string
  created_at: string
}

export default function SendPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`${API_URL}/articles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setArticles(data || []))
  }, [router])

  const handleSend = async () => {
    if (!selectedId) return
    setSending(true)
    setError('')

    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ article_id: selectedId }),
    })

    if (res.ok) {
      setSuccess(true)
      setSending(false)
    } else {
      setError('送信に失敗しました')
      setSending(false)
    }
  }

  return (
     <div className="p-10">
        {success ? (
          <div className="text-center py-20">
            <p className="text-sm font-medium">配信完了しました</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-xs text-black underline"
            >
              ダッシュボードに戻る
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-sm font-medium text-gray-400 mb-8">配信する記事を選択</h2>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm text-gray-400">記事がありません</p>
                <button
                  onClick={() => router.push('/articles/new')}
                  className="mt-4 text-xs text-black underline"
                >
                  記事を書く
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1 mb-8">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedId(article.id)}
                      className={`py-4 border-b cursor-pointer flex justify-between items-center group ${
                        selectedId === article.id ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{article.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(article.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      {selectedId === article.id && (
                        <span className="text-xs text-black">✓</span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSend}
                  disabled={!selectedId || sending}
                  className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-30"
                >
                  {sending ? '送信中...' : '配信する'}
                </button>
              </>
            )}
          </>
        )}
    </div>
  )
}