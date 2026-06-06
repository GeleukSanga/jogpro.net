import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter (resets on cold start — fine for single admin)
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 menit

function getRateLimit(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { blocked: false }
  }
  entry.count++
  if (entry.count > MAX_ATTEMPTS) return { blocked: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  return { blocked: false }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const { blocked, retryAfter } = getRateLimit(ip)
  if (blocked) {
    return NextResponse.json({ error: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((retryAfter || 0) / 60)} menit.` }, { status: 429 })
  }

  try {
    const { password } = await req.json()
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })
    if (password !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    return NextResponse.json({ success: true, token: process.env.ADMIN_KEY })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
