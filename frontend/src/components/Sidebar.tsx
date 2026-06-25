'use client'

import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { label: 'ダッシュボード', href: '/dashboard', icon: '▪' },
  { label: '記事一覧', href: '/articles', icon: '▪' },
  { label: '記事を書く', href: '/articles/new', icon: '▪' },
  { label: '購読者', href: '/subscribers', icon: '▪' },
  { label: 'メール配信', href: '/send', icon: '▪' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <aside className="w-48 min-h-screen border-r bg-white flex flex-col">
      <div className="px-6 py-6 border-b">
        <h1 className="text-lg font-bold tracking-tight">Todoke</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              pathname === item.href
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t">
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          ログアウト
        </button>
      </div>
    </aside>
  )
}