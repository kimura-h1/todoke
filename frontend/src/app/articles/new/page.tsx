'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

export default function NewArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const res = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body }),
    })

    if (res.ok) {
      router.push('/articles')
    } else {
      setError('投稿に失敗しました')
    }
  }

  return (
     <div className="p-10">
        <h2 className="text-sm font-medium text-gray-400 mb-8">記事を書く</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            投稿する
          </button>
        </form>
    </div>
  )
}