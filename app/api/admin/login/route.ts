import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })
    if (password !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    return NextResponse.json({ success: true, token: process.env.ADMIN_KEY })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
