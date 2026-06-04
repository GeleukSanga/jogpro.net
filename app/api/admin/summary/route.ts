import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data, error } = await supabase
    .from('affiliators')
    .select('id, full_name, tiktok_username, affiliator_claims(views_count, commission_amount, status)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const summary = (data || []).map((aff: { id: string; full_name: string; tiktok_username: string; affiliator_claims: Array<{ views_count: number; commission_amount: number; status: string }> }) => {
    const claims = aff.affiliator_claims || []
    const totalViews = claims.reduce((s: number, c: { views_count: number }) => s + (c.views_count || 0), 0)
    const totalKomisi = claims.filter((c: { status: string }) => c.status === 'approved' || c.status === 'paid').reduce((s: number, c: { commission_amount: number }) => s + (c.commission_amount || 0), 0)
    const totalPaid = claims.filter((c: { status: string }) => c.status === 'paid').reduce((s: number, c: { commission_amount: number }) => s + (c.commission_amount || 0), 0)
    return { id: aff.id, full_name: aff.full_name, tiktok_username: aff.tiktok_username, totalViews, totalKomisi, totalPaid, pending: totalKomisi - totalPaid }
  })
  return NextResponse.json(summary)
}
