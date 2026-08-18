import type { ReactNode } from 'react'
import { TopNav } from './TopNav'
import { Footer } from './Footer'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <TopNav />
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 py-6">{children}</main>
      <Footer />
    </div>
  )
}
