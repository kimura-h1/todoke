'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">

      {/* ヘッダー */}
      <header className="border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight">Todoke</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/login')}
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            ログイン
          </button>
          <button
            onClick={() => router.push('/register')}
            className="text-xs bg-black text-white px-3 py-1.5 hover:bg-gray-800 transition-colors"
          >
            無料で始める
          </button>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          あなたの言葉を、<br />読者に届ける
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Todokeは、クリエイターが自分のニュースレターを簡単に配信できるプラットフォームです。
        </p>
        <button
          onClick={() => router.push('/register')}
          className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          無料で始める
        </button>
      </section>

      {/* 機能紹介 */}
      <section className="border-t">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h3 className="text-xs font-medium text-gray-400 mb-8 text-center">機能</h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-medium mb-2">記事を書く</p>
              <p className="text-xs text-gray-400">シンプルなエディタで記事を書いて投稿できます</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">購読者を管理</p>
              <p className="text-xs text-gray-400">購読者を一元管理して配信リストを作れます</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">メールで届ける</p>
              <p className="text-xs text-gray-400">ワンクリックで全購読者にメールを配信できます</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h3 className="text-xl font-bold mb-4">今すぐ始めましょう</h3>
          <p className="text-gray-500 text-sm mb-8">無料で使えます</p>
          <button
            onClick={() => router.push('/register')}
            className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            アカウントを作成する
          </button>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t px-6 py-6 text-center">
        <p className="text-xs text-gray-400">© 2026 Todoke</p>
      </footer>

    </div>
  )
}