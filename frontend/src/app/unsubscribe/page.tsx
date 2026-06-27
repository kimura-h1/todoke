'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUnsubscribe = async () => {
    if (!email) {
      setError('メールアドレスが見つかりません')
      return
    }

    const res = await fetch('http://localhost:8080/unsubscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      setError('解除に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Todoke</h1>

        {success ? (
          <div className="mt-6">
            <p className="text-sm font-medium">購読解除しました</p>
            <p className="text-xs text-gray-400 mt-2">またいつでも購読できます</p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">以下のメールアドレスの購読を解除します</p>
            <p className="text-sm font-medium mb-6">{email}</p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              購読を解除する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  )
}