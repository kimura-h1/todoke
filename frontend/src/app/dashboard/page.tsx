'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [articleCount, setArticleCount] = useState(0)

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
      .then((data) => setSubscriberCount(data?.length || 0))

    fetch(`${API_URL}/articles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setArticleCount(data?.length || 0))
  }, [router])

  return (
    <div className="p-10">
      <h2 className="text-sm font-medium text-gray-400 mb-8">ダッシュボード</h2>
      <div className="grid grid-cols-2 gap-6 max-w-sm">
        <div className="border-b pb-4">
          <p className="text-3xl font-bold">{articleCount}</p>
          <p className="text-xs text-gray-400 mt-1">記事数</p>
        </div>
        <div className="border-b pb-4">
          <p className="text-3xl font-bold">{subscriberCount}</p>
          <p className="text-xs text-gray-400 mt-1">購読者数</p>
        </div>
      </div>
    </div>
  )
}