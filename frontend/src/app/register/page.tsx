'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      router.push('/login')
    } else if (res.status === 409) {
      setError('このメールアドレスはすでに登録されています')
    } else {
      setError('登録に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-6">

        {/* ロゴ */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1">アカウントを作成する</p>
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
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 text-sm font-medium mt-6 hover:bg-gray-800 transition-colors"
          >
            登録する
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          アカウントをお持ちの方は
          <a href="/login" className="text-black underline ml-1">
            ログイン
          </a>
        </p>
      </div>
    </div>
  )
}