import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const { data: affiliator, error } = await supabase
      .from('affiliators')
      .select('*')
      .eq('username', username)
      .eq('status', 'approved')
      .single()

    if (error || !affiliator) {
      return NextResponse.json({ error: 'Username tidak ditemukan atau akun belum diapprove' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, affiliator.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: affiliator.id, username: affiliator.username, full_name: affiliator.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token, full_name: affiliator.full_name, username: affiliator.username })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
