'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

type Subscriber = {
  id: number
  email: string
  created_at: string
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`${API_URL}/subscribers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscribers(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/subscribe`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
     <div className="p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-sm font-medium text-gray-400">購読者一覧</h2>
            <p className="text-xs text-gray-400 mt-0.5">{subscribers.length}人が購読中</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
          >
            {copied ? 'コピーしました' : '購読URLをコピー'}
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">読み込み中...</p>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-400">まだ購読者がいません</p>
            <button
              onClick={handleCopy}
              className="mt-4 text-xs text-black underline"
            >
              購読URLをシェアする
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {subscribers.map((s) => (
              <div key={s.id} className="py-4 border-b flex justify-between items-center">
                <p className="text-sm">{s.email}</p>
                <p className="text-xs text-gray-400">
                  {new Date(s.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}