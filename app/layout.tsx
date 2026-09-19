import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JOGPRO TAROT — A Moment of Clarity',
  description: 'Free tarot for self-reflection. Choose your spread — no signup, just breathe and draw.',
  generator: 'JOGPRO TAROT',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFCF8',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
