'use client'

import { useState } from 'react'
import API_URL from '@/lib/api'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSuccess(true)
      setEmail('')
    } else if (res.status === 409) {
      setError('このメールアドレスはすでに登録されています')
    } else {
      setError('登録に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-6">

        {success ? (
          <div className="text-center">
            <p className="text-sm font-medium">登録完了しました</p>
            <p className="text-xs text-gray-400 mt-2">
              最新の記事をお届けします
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Todoke</h1>
              <p className="text-gray-400 text-sm mt-1">
                最新の記事をメールでお届けします
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                購読する
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}