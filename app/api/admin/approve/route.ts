import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY
}

function generatePassword(length = 8) {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const { affiliator_id } = await req.json()

    const { data: aff } = await supabase.from('affiliators').select('full_name').eq('id', affiliator_id).single()
    if (!aff) return NextResponse.json({ error: 'Affiliator not found' }, { status: 404 })

    const firstName = aff.full_name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')
    const rand = Math.floor(Math.random() * 900) + 100
    const username = `${firstName}${rand}`
    const password = generatePassword()
    const password_hash = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('affiliators').update({ username, password_hash, status: 'approved' }).eq('id', affiliator_id)
    if (error) throw error

    return NextResponse.json({ success: true, username, password })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
