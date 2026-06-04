import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as { id: string }

    const { data: affiliator, error } = await supabase
      .from('affiliators')
      .select('id, username, full_name, whatsapp, city, tiktok_username, tiktok_followers, status, created_at')
      .eq('id', payload.id)
      .single()

    if (error || !affiliator) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: samples } = await supabase
      .from('affiliator_samples')
      .select('*')
      .eq('affiliator_id', payload.id)
      .order('created_at', { ascending: true })

    const { data: claims } = await supabase
      .from('affiliator_claims')
      .select('*')
      .eq('affiliator_id', payload.id)
      .order('created_at', { ascending: false })

    const totalKomisi = (claims || [])
      .filter((c: { status: string; commission_amount: number }) => c.status === 'approved' || c.status === 'paid')
      .reduce((sum: number, c: { commission_amount: number }) => sum + (c.commission_amount || 0), 0)

    return NextResponse.json({ ...affiliator, samples: samples || [], claims: claims || [], total_komisi: totalKomisi })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
