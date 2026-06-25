'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } else {
      setError('メールアドレスまたはパスワードが違います')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-6">

        {/* ロゴ */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-1">ログインしてください</p>
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
            ログイン
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          アカウントをお持ちでない方は
          <a href="/register" className="text-black underline ml-1">
            新規登録
          </a>
        </p>
      </div>
    </div>
  )
}