'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

const noSidebarPages = ['/login', '/register', '/subscribe','/']

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = !noSidebarPages.includes(pathname)

  if (!showSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}