import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }

    const { video_url, views_count, screenshot_url } = await req.json()

    if (!video_url || !views_count) return NextResponse.json({ error: 'Video URL dan jumlah views wajib diisi' }, { status: 400 })
    if (parseInt(views_count) < 1000) return NextResponse.json({ error: 'Minimal 1.000 views untuk klaim' }, { status: 400 })

    const commission_amount = Math.floor(parseInt(views_count) / 1000) * 5000

    const { error } = await supabase.from('affiliator_claims').insert({
      affiliator_id: payload.id,
      video_url,
      views_count: parseInt(views_count),
      screenshot_url: screenshot_url || null,
      status: 'pending',
      commission_amount
    })

    if (error) throw error
    return NextResponse.json({ success: true, commission_amount })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
