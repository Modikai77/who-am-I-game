import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Who Are You?',
  description: 'A playful personality quiz for kids.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-accent-mint/20 text-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}
