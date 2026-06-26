'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`http://localhost:8080/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title)
        setBody(data.body)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const res = await fetch(`http://localhost:8080/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body }),
    })

    if (res.ok) {
      router.push('/articles')
    } else {
      setError('更新に失敗しました')
    }
  }

  if (loading) {
    return <div className="p-10"><p className="text-sm text-gray-400">読み込み中...</p></div>
  }

  return (
    <div className="p-10">
      <h2 className="text-sm font-medium text-gray-400 mb-8">記事を編集する</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors"
            placeholder="記事のタイトル"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            本文
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors resize-none h-64"
            placeholder="記事の本文を書いてください"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            更新する
          </button>
          <button
            type="button"
            onClick={() => router.push('/articles')}
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}