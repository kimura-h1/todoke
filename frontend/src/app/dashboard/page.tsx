'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

    fetch('http://localhost:8080/subscribers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubscriberCount(data?.length || 0))

    fetch('http://localhost:8080/articles', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setArticleCount(data?.length || 0))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const menus = [
    {
      title: '記事を書く',
      description: '新しいニュースレターを作成する',
      href: '/articles/new',
    },
    {
      title: '記事一覧',
      description: '投稿した記事を管理する',
      href: '/articles',
    },
    {
      title: '購読者一覧',
      description: '購読者を確認する',
      href: '/subscribers',
    },
    {
      title: 'メール配信',
      description: '購読者に記事を送る',
      href: '/send',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight">Newsletter</h1>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          ログアウト
        </button>
      </header>

      <main className="max-w-2xl mx-auto mt-12 px-6">

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="border-b pb-4">
            <p className="text-3xl font-bold">{articleCount}</p>
            <p className="text-xs text-gray-400 mt-1">記事数</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-3xl font-bold">{subscriberCount}</p>
            <p className="text-xs text-gray-400 mt-1">購読者数</p>
          </div>
        </div>

        {/* メニュー */}
        <div className="space-y-1">
          {menus.map((menu) => (
            <div
              key={menu.href}
              onClick={() => router.push(menu.href)}
              className="flex justify-between items-center py-4 border-b cursor-pointer group"
            >
              <div>
                <p className="text-sm font-medium group-hover:text-gray-500 transition-colors">
                  {menu.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{menu.description}</p>
              </div>
              <span className="text-gray-300 group-hover:text-gray-500 transition-colors">
                →
              </span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}