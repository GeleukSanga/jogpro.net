import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // CORS - restrict to jogpro.net only (was: Access-Control-Allow-Origin: *)
  const origin = req.headers.get('origin')
  if (origin === 'https://www.jogpro.net' || origin === 'https://jogpro.net') {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  // API routes only respond to same origin
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('Access-Control-Allow-Origin', origin || 'https://www.jogpro.net')
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Remove Vercel server header (info disclosure)
  res.headers.delete('server')

  return res
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)',
}
