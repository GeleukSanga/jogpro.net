import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const HASH = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) return NextResponse.json({ success: false, message: 'Password wajib' }, { status: 400 })
    if (!HASH) return NextResponse.json({ success: false, message: 'Server belum set ADMIN_PASSWORD_HASH' }, { status: 500 })

    // Support bcrypt hash or sha256 hex (fallback)
    let ok = false
    if (HASH.startsWith('$2a$') || HASH.startsWith('$2b$') || HASH.startsWith('$2y$')) {
      ok = bcrypt.compareSync(password, HASH)
    } else {
      // sha256 fallback
      const crypto = await import('crypto')
      const sha = crypto.createHash('sha256').update(password).digest('hex')
      ok = sha === HASH
    }

    if (!ok) return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 })

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    })
    return res
  } catch (e) {
    console.error('login error', e)
    return NextResponse.json({ success: false, message: 'Gagal login' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_auth', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
