import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set')

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }

    const { video_url, views_count, screenshot_url } = await req.json()

    if (!video_url || !views_count) return NextResponse.json({ error: 'Video URL dan jumlah views wajib diisi' }, { status: 400 })

    const views = parseInt(views_count)
    if (views < 500) return NextResponse.json({ error: 'Minimal 500 views untuk klaim' }, { status: 400 })

    // Hitung milestone: kelipatan 500 terdekat yang belum diklaim
    const milestone = Math.floor(views / 500) * 500

    // Cek apakah milestone ini sudah diklaim untuk video ini
    const { data: existing } = await supabase
      .from('affiliator_claims')
      .select('id')
      .eq('affiliator_id', payload.id)
      .eq('video_url', video_url)
      .eq('milestone', milestone)
      .single()

    if (existing) {
      return NextResponse.json({ error: `Milestone ${milestone} views untuk video ini sudah pernah diklaim` }, { status: 400 })
    }

    const commission_amount = 2500 // Rp 2.500 per milestone 500 views

    const { error } = await supabase.from('affiliator_claims').insert({
      affiliator_id: payload.id,
      video_url,
      views_count: views,
      milestone,
      screenshot_url: screenshot_url || null,
      status: 'pending',
      commission_amount,
    })

    if (error) throw error
    return NextResponse.json({ success: true, commission_amount, milestone })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
